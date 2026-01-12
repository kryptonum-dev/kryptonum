import { useState, useEffect, useRef } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import Input from '@repo/ui/Input'
import Checkbox from '@repo/ui/Checkbox'
import { REGEX } from '@repo/shared/constants';
import { sendContactEmail, type Props as sendContactEmailProps } from '@apps/www/pages/api/contact/sendContactEmail';
import { DOMAIN } from '@repo/shared/constants';

const TURNSTILE_SITE_KEY = "0x4AAAAAACMBUyp7IalZNTGl";
import { type Language } from '@repo/shared/languages';
import { trackEvent } from '@apps/links/src/pages/api/analytics/track-event';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback': () => void; theme: string }) => string;
      reset: (widgetId: string) => void;
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
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    setFocus,
  } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    // Load Turnstile script
    if (!document.querySelector('script[src*="turnstile"]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize Turnstile when script is loaded
    const initTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !turnstileWidgetId.current) {
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          theme: 'dark',
        });
      }
    };

    // Check if already loaded or wait for it
    if (window.turnstile) {
      initTurnstile();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          initTurnstile();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const tryAgain = () => {
      setStatus('idle');
      // Reset Turnstile on retry
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
        setTurnstileToken('');
      }
    };
    document.addEventListener('Contact-TryAgain', tryAgain);
    if (variant === 'form-with-person') {
      const nextStep = async () => {
        const isMessageValid = await trigger('message');
        if (isMessageValid) setStep(2);
        // Wait for next frame to ensure DOM is updated and element is visible before focusing
        requestAnimationFrame(() => setFocus('email'));
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
    const response = await sendContactEmail({
      ...data as sendContactEmailProps,
      turnstileToken,
    });
    if (response.success) {
      setStatus('success');
      reset();
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_submit');
      if (shouldTrackAnalytics()) {
        trackEvent({
          user_data: {
            email: data.email as string,
          },
          meta: {
            event_name: 'Lead',
            content_name: 'contact_form',
            params: {
              form_variant: variant,
            }
          },
          ga: {
            event_name: 'generate_lead',
            params: {
              content_name: 'contact_form',
              form_variant: variant,
            }
          }
        });
      }
    } else {
      setStatus('error');
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_error');
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
      <div ref={turnstileRef} className="turnstile-container" />
      {children}
    </form>
  )
}
