import { useState, useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import Input from '@repo/ui/Input'
import Checkbox from '@repo/ui/Checkbox'
import Select from '@repo/ui/Select'
import { REGEX, DOMAIN } from '@repo/shared/constants';
import { sendContactEmail, type Props as sendContactEmailProps } from '@apps/www/pages/api/contact/sendContactEmail';
import { type Language } from '@repo/shared/languages';
import { trackEvent, updateAnalyticsUser } from '../../../analytics';
import { getUtmForSheet } from '../../../analytics/utm-storage';

const shouldTrackAnalytics = () => {
  if (typeof window !== 'undefined') {
    return !window.location.hostname.startsWith('kryptonum.eu');
  }
  return false;
};

type Variant = 'form-with-list' | 'form-with-person' | 'form-lead';

type Props = {
  children: React.ReactNode,
  variant: Variant;
  lang: Language
  dropdownOptions?: string[]
  dropdownLabel?: string
  dropdownPlaceholder?: string
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
    phoneLabel: 'Twój numer telefonu',
    phonePlaceholder: '+48 ___ ___ ___',
    phoneRequired: 'Numer telefonu jest wymagany',
    phoneInvalid: 'Niepoprawny numer telefonu',
    dropdownRequired: 'To pole jest wymagane',
  },
  en: {
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
    messageLabel: 'Subject',
    messagePlaceholder: 'Let us know what we will talk about',
    messageRequired: 'Message is required',
    legal: <>I accept <a href={`${DOMAIN}/en/privacy-policy`} target="_blank" rel="noopener noreferrer" className="link">privacy policy</a></>,
    legalRequired: 'Consent is required',
    phoneLabel: 'Your phone number',
    phonePlaceholder: '+48 ___ ___ ___',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Invalid phone number',
    dropdownRequired: 'This field is required',
  },
}

const hasMultiStep = (variant: Variant) => variant === 'form-with-person' || variant === 'form-lead';

export default function Form({ children, variant, lang, dropdownOptions, dropdownLabel, dropdownPlaceholder, ...props }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [step, setStep] = useState<1 | 2>(1);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    setFocus,
  } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    const tryAgain = () => setStatus('idle');
    document.addEventListener('Contact-TryAgain', tryAgain);
    if (hasMultiStep(variant)) {
      const nextStep = async () => {
        const fieldsToValidate = variant === 'form-lead'
          ? (['phone', 'dropdown'] as const)
          : (['message'] as const);
        const isValid = await trigger(fieldsToValidate as unknown as string[]);
        if (isValid) {
          setStep(2);
          requestAnimationFrame(() => setFocus('email'));
        }
      }
      const prevStep = () => {
        setStep(1);
        requestAnimationFrame(() => setFocus(variant === 'form-lead' ? 'phone' : 'message'));
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

    fetch(`${DOMAIN}/api/s3d`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        message: data.message,
        phone: data.phone,
        dropdown: data.dropdown,
        utm: getUtmForSheet(),
        source: typeof window !== 'undefined' ? window.location.hostname + window.location.pathname : '',
      }),
      keepalive: true,
    }).catch(() => {});

    const response = await sendContactEmail(data as sendContactEmailProps);
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
  };

  const t = translations[lang];

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} data-status={status} data-variant={variant} data-step={hasMultiStep(variant) ? step : undefined}>
      {variant === 'form-with-list' && (
        <>
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
          />
          <Input
            label={t.messageLabel}
            register={register('message', {
              required: { value: true, message: t.messageRequired },
            })}
            isTextarea={true}
            errors={errors}
            placeholder={t.messagePlaceholder}
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: t.legalRequired },
            })}
            errors={errors}
          >
            {t.legal}
          </Checkbox>
        </>
      )}
      {variant === 'form-with-person' && (
        <>
          <Input
            label={t.messageLabel}
            register={register('message', {
              required: { value: true, message: t.messageRequired },
            })}
            isTextarea={true}
            errors={errors}
            placeholder={t.messagePlaceholder}
          />
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: t.legalRequired },
            })}
            errors={errors}
          >
            {t.legal}
          </Checkbox>
        </>
      )}
      {variant === 'form-lead' && (
        <>
          <Input
            label={t.phoneLabel}
            register={register('phone', {
              required: { value: true, message: t.phoneRequired },
              pattern: { value: REGEX.phone, message: t.phoneInvalid },
            })}
            errors={errors}
            type='tel'
            inputMode='tel'
            autoComplete='tel'
            placeholder={t.phonePlaceholder}
          />
          <Select
            label={dropdownLabel || ''}
            placeholder={dropdownPlaceholder}
            options={dropdownOptions || []}
            register={register('dropdown', {
              required: { value: true, message: t.dropdownRequired },
            })}
            errors={errors}
          />
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: t.emailRequired },
              pattern: { value: REGEX.email, message: t.emailInvalid },
            })}
            errors={errors}
            type='email'
            inputMode='email'
            autoComplete='email'
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: t.legalRequired },
            })}
            errors={errors}
          >
            {t.legal}
          </Checkbox>
        </>
      )}
      {children}
    </form>
  )
}
