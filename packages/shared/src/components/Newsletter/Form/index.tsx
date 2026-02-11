import { useState, useEffect } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import Input from '@repo/ui/Input'
import Checkbox from '@repo/ui/Checkbox'
import { REGEX } from '@repo/shared/constants';
import { subscribeToNewsletter, type Props as subscribeToNewsletterProps } from '@apps/www/pages/api/newsletter/subscribeToNewsletter';
import { DOMAIN } from '@repo/shared/constants';
import { type Language } from '@repo/shared/languages';
import { trackEvent, updateAnalyticsUser } from '../../../analytics';

const shouldTrackAnalytics = () => {
  if (typeof window !== 'undefined') {
    return !window.location.hostname.startsWith('kryptonum.eu');
  }
  return false;
};

type Props = {
  children: React.ReactNode,
  groupId: string;
  lang: Language
} & React.FormHTMLAttributes<HTMLFormElement>

const translations = {
  pl: {
    emailLabel: 'Email',
    emailRequired: 'Email jest wymagany',
    emailInvalid: 'Niepoprawny adres e-mail',
    nameLabel: 'Imię',
    nameRequired: 'Imię jest wymagane',
    legal: <>Akceptuję <a href={`${DOMAIN}/pl/polityka-prywatnosci`} target="_blank" rel="noopener noreferrer" className="link">politykę prywatności</a></>,
    legalRequired: 'Zgoda jest wymagana',
  },
  en: {
    emailLabel: 'Email',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
    nameLabel: 'Name',
    nameRequired: 'Name is required',
    legal: <>I accept <a href={`${DOMAIN}/en/privacy-policy`} target="_blank" rel="noopener noreferrer" className="link">privacy policy</a></>,
    legalRequired: 'Consent is required',
  },
}

export default function Form({ children, groupId, lang, ...props }: Props) {
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
    const prevStep = () => {
      setStep(1);
      // Wait for next frame to ensure DOM is updated and element is visible before focusing
      requestAnimationFrame(() => setFocus('email'));
    }
    const nextStep = async () => {
      const isEmailValid = await trigger('email');
      if (isEmailValid) setStep(2);
      requestAnimationFrame(() => setFocus('name'));
    }
    const handleKeyPress = async (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      if (e.key === 'Enter' && step === 1 && target.closest('.Newsletter') && target.name === 'email') {
        e.preventDefault();
        const isEmailValid = await trigger('email');
        if (isEmailValid) setStep(2);
        requestAnimationFrame(() => setFocus('name'));
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('Newsletter-TryAgain', tryAgain);
    document.addEventListener('Newsletter-NextStep', nextStep);
    document.addEventListener('Newsletter-PrevStep', prevStep);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('Newsletter-TryAgain', tryAgain);
      document.removeEventListener('Newsletter-NextStep', nextStep);
      document.removeEventListener('Newsletter-PrevStep', prevStep);
    }
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setStatus('loading');
    data.groupId = groupId;
    const response = await subscribeToNewsletter(data as subscribeToNewsletterProps);
    if (response.success) {
      setStatus('success');
      reset();
      if (typeof fathom !== 'undefined') fathom.trackEvent('newsletter_subscribe');
      if (shouldTrackAnalytics()) {
        updateAnalyticsUser({
          email: data.email as string,
          first_name: data.name as string,
        });
        trackEvent({
          user: {
            email: data.email as string,
            first_name: data.name as string,
          },
          meta: {
            eventName: 'Lead',
            contentName: 'newsletter_subscription',
          },
          ga4: {
            eventName: 'generate_lead',
            params: {
              form_name: 'newsletter_subscription',
            }
          }
        });
      }
    } else {
      setStatus('error');
      if (typeof fathom !== 'undefined') fathom.trackEvent('newsletter_error');
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} data-status={status} data-step={step}>
      <Input
        label={translations[lang].emailLabel}
        register={register('email', {
          required: { value: true, message: translations[lang].emailRequired },
          pattern: { value: REGEX.email, message: translations[lang].emailInvalid },
        })}
        errors={errors}
        type='email'
      />
      <Input
        label={translations[lang].nameLabel}
        register={register('name', {
          required: { value: true, message: translations[lang].nameRequired },
        })}
        errors={errors}
      />
      <Checkbox
        register={register('legal', {
          required: { value: true, message: translations[lang].legalRequired },
        })}
        errors={errors}
      >
        {translations[lang].legal}
      </Checkbox>
      {children}
    </form>
  )
}
