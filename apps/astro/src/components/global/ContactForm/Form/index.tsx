import { useState, useEffect } from 'preact/hooks';
import { useForm, type FieldValues } from 'react-hook-form';
import type { Props as ContactFormProps } from '../ContactForm.astro';
import Input from '@repo/ui/Input'
import Checkbox from '@repo/ui/Checkbox'
import { REGEX } from '@repo/shared/constants';
import { sendContactEmail, type Props as sendContactEmailProps } from '@pages/api/contact/sendContactEmail';

export default function Form({ children, variant, ...props }: { children: React.ReactNode, variant: ContactFormProps['variant'] } & React.FormHTMLAttributes<HTMLFormElement>) {
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
    const response = await sendContactEmail(data as sendContactEmailProps);
    if (response.success) {
      setStatus('success');
      reset();
      if (typeof fathom !== 'undefined') fathom.trackEvent('contactForm_submit');
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
              required: { value: true, message: 'Email jest wymagany' },
              pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
            })}
            errors={errors}
            type='email'
          />
          <Input
            label='Temat rozmowy'
            register={register('message', {
              required: { value: true, message: 'Temat jest wymagany' },
            })}
            isTextarea={true}
            errors={errors}
            placeholder='Daj znać, o czym porozmawiamy'
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: 'Zgoda jest wymagana' },
            })}
            errors={errors}
          >
            Akceptuję <a href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer" className="link">
              politykę prywatności
            </a>
          </Checkbox>
        </>
      )}
      {variant === 'form-with-person' && (
        <>
          <Input
            label='Temat rozmowy'
            register={register('message', {
              required: { value: true, message: 'Temat jest wymagany' },
            })}
            isTextarea={true}
            errors={errors}
            placeholder='Daj znać, o czym porozmawiamy'
          />
          <Input
            label='Email'
            register={register('email', {
              required: { value: true, message: 'Email jest wymagany' },
              pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
            })}
            errors={errors}
            type='email'
          />
          <Checkbox
            register={register('legal', {
              required: { value: true, message: 'Zgoda jest wymagana' },
            })}
            errors={errors}
          >
            Akceptuję <a href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer" className="link">
              politykę prywatności
            </a>
          </Checkbox>
        </>
      )}
      {children}
    </form>
  )
}
