'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Button from '@/components/Button'
import styles from './page.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [generalError, setGeneralError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})
    setGeneralError('')
    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setGeneralError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (signInResult?.error) {
        setSuccess(true)
        setGeneralError('Account created, but automatic login failed. Please log in manually.')
        setLoading(false)
        router.push('/login')
        return
      }

      setSuccess(true)
      router.push('/recipes')
      router.refresh()
    } catch {
      setGeneralError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <Card title="Create Account">
          {generalError && <div className={styles.error}>{generalError}</div>}
          {success && <div className={styles.success}>Account created! Signing you in...</div>}

          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
              required
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password (min 6 characters)"
              required
              error={errors.password}
            />

            <Button type="submit" fullWidth disabled={loading || success}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </Card>

        <Link href="/login" className={styles.link}>
          Already have an account? Login
        </Link>
      </div>
    </div>
  )
}
