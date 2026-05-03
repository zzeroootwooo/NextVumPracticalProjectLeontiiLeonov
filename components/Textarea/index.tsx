import styles from './Textarea.module.css'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  const textareaClasses = [
    styles.textarea,
    error ? styles.error : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea className={textareaClasses} {...props} />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}
