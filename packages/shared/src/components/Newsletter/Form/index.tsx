import { useState, useEffect } from 'preact/hooks';
import { useForm, type FieldValues } from 'react-hook-form';
import Input from '@repo/ui/Input'
import Checkbox from '@repo/ui/Checkbox'
import { REGEX } from '@repo/shared/constants';
import { subscribeToNewsletter, type Props as subscribeToNewsletterProps } from '@apps/www/pages/api/newsletter/subscribeToNewsletter';

export default function Form({ children, groupId, ...props }: { children: React.ReactNode, groupId: string } & React.FormHTMLAttributes<HTMLFormElement>) {
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
    } else {
      setStatus('error');
      if (typeof fathom !== 'undefined') fathom.trackEvent('newsletter_error');
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} data-status={status} data-step={step}>
      <Input
        label='Email'
        register={register('email', {
          required: { value: true, message: 'Email jest wymagany' },
          pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
        })}
        errors={errors}
        type='email'
      />
      <Input
        label='Imię'
        register={register('name', {
          required: { value: true, message: 'Imię jest wymagane' },
        })}
        errors={errors}
      />
      <Checkbox
        register={register('legal', {
          required: { value: true, message: 'Zgoda jest wymagana' },
        })}
        errors={errors}
      >
        Akceptuję <a href="/pl/polityka-prywatnosci" target="_blank" rel="noopener noreferrer" className="link">
          politykę prywatności
        </a>
      </Checkbox>
      {children}
    </form>
  )
}
