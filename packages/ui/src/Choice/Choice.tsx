import { useId, type ChangeEvent } from 'react'
import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form'
import styles from './Choice.module.scss'
import Error from '../Error'

type Props = {
  register: UseFormRegisterReturn
  label: string
  hint?: string
  options: readonly string[]
  /** Several answers at once (checkboxes) instead of one (radio buttons) */
  multiple?: boolean
  errors: FieldErrors
  /** Called after the form state is updated, with the tile that was tapped */
  onPick?: (value: string, checked: boolean) => void
}

/**
 * A question answered by tapping a tile. All answers are visible at once and
 * one tap picks one, where a dropdown needs the list opened and scrolled.
 */
export default function Choice({ register, label, hint, options, multiple = false, errors, onPick }: Props) {
  const labelId = useId()
  const { onChange, ...restRegister } = register
  const error = errors[register.name]?.message?.toString()

  return (
    <div className={styles.Choice} role={multiple ? 'group' : 'radiogroup'} aria-labelledby={labelId} aria-invalid={!!error}>
      <div className={styles['label-wrapper']}>
        <p className={styles.label} id={labelId}>{label}</p>
        <Error error={error} />
      </div>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.options}>
        {options.map((option) => (
          <label className={styles.option} key={option}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              value={option}
              {...restRegister}
              onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                const { value, checked } = event.target
                await onChange(event)
                onPick?.(value, checked)
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
