import styles from './Error.module.scss'

type Props = {
  error?: string;
  withIcon?: boolean;
}

export default function Error({ error, withIcon = false }: Props) {
  return (
    error && (
      <span
        className={styles.Error}
        aria-live="assertive"
        role='alert'
        aria-icon={withIcon.toString()}
      >{error}</span>
    )
  );
}
