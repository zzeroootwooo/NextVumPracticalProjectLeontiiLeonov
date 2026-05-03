import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  const inputClasses = [
    styles.input,
    error ? styles.error : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}
