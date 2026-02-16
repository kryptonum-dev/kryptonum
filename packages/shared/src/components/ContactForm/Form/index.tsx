import { useState, useEffect, useRef } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import Input from '@repo/ui/Input'
import Checkbox from '@repo/ui/Checkbox'
import { REGEX } from '@repo/shared/constants';
import { sendContactEmail, type Props as sendContactEmailProps } from '@apps/www/pages/api/contact/sendContactEmail';
import { DOMAIN } from '@repo/shared/constants';
import { type Language } from '@repo/shared/languages';
import { trackEvent, updateAnalyticsUser } from '../../../analytics';
import { getUtmForSheet } from '../../../analytics/utm-storage';

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string;

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const shouldTrackAnalytics = () => {
  if (typeof window !== 'undefined') {
    return !window.location.hostname.startsWith('kryptonum.eu');
  }
  return false;
};

type Props = {
  children: React.ReactNode,
  variant: 'form-with-list' | 'form-with-person';
  lang: Language
} & React.FormHTMLAttributes<HTMLFormElement>

const translations = {
  pl: {
    emailRequired: 'Email jest wymagany',
    emailInvalid: 'Niepoprawny adres e-mail',
    messageLabel: 'Temat rozmowy',
    messagePlaceholder: 'Daj znać, o czym porozmawiamy',
    messageRequired: 'Temat jest wymagany',
    legal: <>Akceptuję <a href={`${DOMAIN}/pl/polityka-prywatnosci`} target="_blank" rel="noopener noreferrer" className="link">politykę prywatności</a></>,
    legalRequired: 'Zgoda jest wymagana',
  },
  en: {
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
    messageLabel: 'Subject',
    messagePlaceholder: 'Let us know what we will talk about',
    messageRequired: 'Message is required',
    legal: <>I accept <a href={`${DOMAIN}/en/privacy-policy`} target="_blank" rel="noopener noreferrer" className="link">privacy policy</a></>,
    legalRequired: 'Consent is required',
  },
}

export default function Form({ children, variant, lang, ...props }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [step, setStep] = useState<1 | 2>(1);
  const turnstileToken = useRef<string>('');
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    setFocus,
  } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => { turnstileToken.current = token; },
        'expired-callback': () => { turnstileToken.current = ''; },
        'error-callback': () => { turnstileToken.current = ''; },
        appearance: 'interaction-only',
        retry: 'auto',
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const existing = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
      if (!existing) {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.addEventListener('load', renderWidget);
        document.head.appendChild(script);
      } else {
        existing.addEventListener('load', renderWidget);
      }
    }

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const tryAgain = () => {
      setStatus('idle');
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
        turnstileToken.current = '';
      }
    };
    document.addEventListener('Contact-TryAgain', tryAgain);
    if (variant === 'form-with-person') {
      const nextStep = async () => {
        const isMessageValid = await trigger('message');
        if (isMessageValid) {
          setStep(2);
          requestAnimationFrame(() => setFocus('email'));
        }
      }
      const prevStep = () => {
        setStep(1);
        requestAnimationFrame(() => setFocus('message'));
      }
      document.addEventListener('Contact-NextStep', nextStep);
      document.addEventListener('Contact-PrevStep', prevStep);
      return () => {
        document.removeEventListener('Contact-TryAgain', tryAgain);
        document.removeEventListener('Contact-NextStep', nextStep);
        document.removeEventListener('Contact-PrevStep', prevStep);
      }
    }
    return () => document.removeEventListener('Contact-TryAgain', tryAgain);
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setStatus('loading');

    const token = turnstileToken.current;

    // Fire and forget - log to Google Sheet
    fetch(`${DOMAIN}/api/s3d`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        message: data.message,
        utm: getUtmForSheet(),
        source: typeof window !== 'undefined' ? window.location.hostname : '',
      }),
      keepalive: true,
    }).catch(() => {});

    const response = await sendContactEmail({
      ...data as sendContactEmailProps,
      turnstileToken: token,
    });
    if (response.success) {
      setStatus('success');
      reset();
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_submit');
      if (shouldTrackAnalytics()) {
        updateAnalyticsUser({ email: data.email as string });
        trackEvent({
          user: {
            email: data.email as string,
          },
          meta: {
            eventName: 'Lead',
            contentName: 'contact_form',
            params: {
              form_name: `contact_form_${variant}`,
            }
          },
          ga4: {
            eventName: 'generate_lead',
            params: {
              form_name: `contact_form_${variant}`,
            }
          }
        });
      }
    } else {
      setStatus('error');
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_error');
    }

    // Reset Turnstile for next attempt (tokens are single-use)
    if (window.turnstile && turnstileWidgetId.current) {
      window.turnstile.reset(turnstileWidgetId.current);
      turnstileToken.current = '';
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} data-status={status} data-variant={variant} data-step={variant === 'form-with-person' ? step : undefined}>
      {variant === 'form-with-list' && (
        <>
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: translations[lang].emailRequired },
              pattern: { value: REGEX.email, message: translations[lang].emailInvalid },
            })}
            errors={errors}
            type='email'
          />
          <Input
            label={translations[lang].messageLabel}
            register={register('message', {
              required: { value: true, message: translations[lang].messageRequired },
            })}
            isTextarea={true}
            errors={errors}
            placeholder={translations[lang].messagePlaceholder}
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: translations[lang].legalRequired },
            })}
            errors={errors}
          >
            {translations[lang].legal}
          </Checkbox>
        </>
      )}
      {variant === 'form-with-person' && (
        <>
          <Input
            label={translations[lang].messageLabel}
            register={register('message', {
              required: { value: true, message: translations[lang].messageRequired },
            })}
            isTextarea={true}
            errors={errors}
            placeholder={translations[lang].messagePlaceholder}
          />
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: translations[lang].emailRequired },
              pattern: { value: REGEX.email, message: translations[lang].emailInvalid },
            })}
            errors={errors}
            type='email'
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: translations[lang].legalRequired },
            })}
            errors={errors}
          >
            {translations[lang].legal}
          </Checkbox>
        </>
      )}
      <div ref={turnstileRef} />
      {children}
    </form>
  )
}
