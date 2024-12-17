import type { FieldErrors } from 'react-hook-form'
import styles from './Input.module.scss'
import Error from '../error'
import Textarea from './Textarea'

type Props = {
  register: {
    name: string
  }
  label: string
  isTextarea?: boolean
  errors: FieldErrors;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>

export default function Input({ register, label, isTextarea, errors, ...props }: Props) {
  const Element = isTextarea ? Textarea : 'input'

  return (
    <label className={styles.Input}>
      <div className={styles['label-wrapper']}>
        <p className={styles.label}>{label}</p>
        <Error error={errors[register.name]?.message?.toString()} />
      </div>
      <Element {...register} {...props} aria-invalid={!!errors[register.name]} />
    </label>
  )
}
