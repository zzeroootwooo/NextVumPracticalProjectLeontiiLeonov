'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'
import { RecipeFormData } from '@/types'
import styles from './page.module.css'

export default function NewRecipePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    cookingTime: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          cookingTime: parseInt(formData.cookingTime as string)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create recipe')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/recipes/${data.id}`)
      }, 1000)
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Recipe</h1>
          <p className={styles.subtitle}>
            Share your delicious recipe with the community
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Recipe created! Redirecting...</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <Input
              label="Recipe Title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Chocolate Chip Cookies"
              required
            />

            <Input
              label="Cooking Time (minutes)"
              type="number"
              min="1"
              value={formData.cookingTime}
              onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
              placeholder="e.g., 30"
              required
            />
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your recipe..."
            required
            rows={3}
          />

          <Textarea
            label="Ingredients"
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            placeholder="List all ingredients (one per line)&#10;e.g.,&#10;2 cups flour&#10;1 cup sugar&#10;3 eggs"
            required
            rows={6}
          />

          <Textarea
            label="Instructions"
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Step-by-step instructions..."
            required
            rows={8}
          />

          <div className={styles.actions}>
            <Button type="submit" fullWidth disabled={loading || success}>
              {loading ? 'Creating...' : 'Create Recipe'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={loading || success}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
