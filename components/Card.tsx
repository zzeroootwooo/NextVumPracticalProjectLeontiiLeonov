import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export default function Card({ children, title, className = '' }: CardProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  )
}
