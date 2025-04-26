import type { FieldErrors } from 'react-hook-form';
import Error from '../Error'
import styles from './Checkbox.module.scss'

type Props = {
  register: {
    name: string
  }
  children: React.ReactNode
  errors: FieldErrors;
} & React.LabelHTMLAttributes<HTMLLabelElement>

export default function Checkbox({ children, register, errors, ...props }: Props) {
  return (
    <label className={styles.Checkbox} {...props}>
      <Error error={errors[register.name]?.message?.toString()} withIcon />
      <div className={styles.checkmark}>
        <input type="checkbox" {...register} aria-invalid={!!errors[register.name]} />
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="none" viewBox="0 0 10 8">
          <path stroke="url(#paint0_linear_6379_11850)" strokeLinecap="round" strokeLinejoin="round" d="m.914 4.584 2.333 2.333 5.834-5.833" />
          <defs>
            <linearGradient id="paint0_linear_6379_11850" x1="8.928" x2=".461" y1="1.084" y2="1.839" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2DD282" />
              <stop offset="1" stopColor="#90F4E8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p>{children}</p>
    </label>
  )
}
