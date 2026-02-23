import { useRef, type ChangeEvent } from 'react'
import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form'
import styles from './Select.module.scss'
import Error from '../Error'

type Props = {
  register: UseFormRegisterReturn
  label: string
  placeholder?: string
  options: string[]
  errors: FieldErrors;
}

export default function Select({ register, label, placeholder, options, errors }: Props) {
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const { ref: registerRef, onChange: registerOnChange, ...restRegister } = register

  return (
    <label className={styles.Select}>
      <div className={styles['label-wrapper']}>
        <p className={styles.label}>{label}</p>
        <Error error={errors[register.name]?.message?.toString()} />
      </div>
      <select
        {...restRegister}
        ref={(el) => {
          registerRef(el)
          selectRef.current = el
        }}
        aria-invalid={!!errors[register.name]}
        className={styles.placeholder}
        defaultValue=""
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          if (e.target.value) {
            e.target.classList.remove(styles.placeholder)
          } else {
            e.target.classList.add(styles.placeholder)
          }
          registerOnChange(e)
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
