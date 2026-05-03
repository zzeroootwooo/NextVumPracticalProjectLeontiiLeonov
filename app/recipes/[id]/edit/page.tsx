'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'
import { Recipe, RecipeFormData } from '@/types'
import styles from './page.module.css'

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
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
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${params.id}`)

        if (!response.ok) {
          setError('Recipe not found')
          setFetchLoading(false)
          return
        }

        const data: Recipe = await response.json()
        setRecipe(data)
        setFormData({
          title: data.title,
          description: data.description,
          ingredients: data.ingredients,
          instructions: data.instructions,
          cookingTime: data.cookingTime.toString()
        })
        setFetchLoading(false)
      } catch (error) {
        setError('Failed to load recipe')
        setFetchLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/recipes/${params.id}`, {
        method: 'PUT',
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
        setError(data.error || 'Failed to update recipe')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/recipes/${params.id}`)
      }, 1000)
    } catch (error) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading recipe...</div>
      </div>
    )
  }

  if (error && !recipe) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.error}>{error}</div>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Recipe</h1>
          <p className={styles.subtitle}>
            Update your recipe details
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Recipe updated! Redirecting...</div>}

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
            placeholder="List all ingredients (one per line)"
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
              {loading ? 'Saving...' : 'Save Changes'}
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
