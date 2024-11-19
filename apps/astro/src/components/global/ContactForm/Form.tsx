import { useState, useEffect } from 'preact/hooks';
import { useForm, type FieldValues } from 'react-hook-form';
import Input from '@/components/ui/Input/Input'
import Checkbox from '@/components/ui/Checkbox'
import { REGEX } from '@/global/constants';
import { sendContactEmail, type Props as sendContactEmailProps } from '@/src/pages/api/contact/sendContactEmail';

export default function Form({ children, ...props }: { children: React.ReactNode } & React.FormHTMLAttributes<HTMLFormElement>) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  useEffect(() => {
    const tryAgain = () => setStatus('idle');
    document.addEventListener('ContactForm-TryAgain', tryAgain);
    return () => document.removeEventListener('ContactForm-TryAgain', tryAgain);
  }, []);

  const onSubmit = async (data: FieldValues) => {
    setStatus('loading');
    const response = await sendContactEmail(data as sendContactEmailProps);
    if (response.success) {
      setStatus('success');
      reset();
    } else {
      setStatus('error');
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit(onSubmit)} data-status={status} >
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
        placeholder='Daj znać, o czym chcesz pogadać :)'
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
      {children}
    </form>
  )
}
