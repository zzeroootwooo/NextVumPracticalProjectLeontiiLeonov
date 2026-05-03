'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

interface DeleteButtonProps {
  recipeId: string
  recipeTitle: string
}

export default function DeleteButton({ recipeId, recipeTitle }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${recipeTitle}"? This action cannot be undone.`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to delete recipe')
        setLoading(false)
        return
      }

      router.push('/recipes')
      router.refresh()
    } catch (error) {
      alert('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <Button
      variant="danger"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
