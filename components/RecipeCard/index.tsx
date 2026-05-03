import Link from 'next/link'
import { Recipe } from '@/types'
import styles from './RecipeCard.module.css'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const recipeEmojis = ['🍕', '🍝', '🍔', '🍜', '🥗', '🍰', '🍱', '🥘', '🍛', '🥙']
  const randomEmoji = recipeEmojis[recipe.id.charCodeAt(0) % recipeEmojis.length]

  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}>
        {randomEmoji}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.description}>{recipe.description}</p>

        <div className={styles.meta}>
          <div className={styles.time}>
            <span>⏱️</span>
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className={styles.author}>
            by {recipe.user?.name || 'Unknown'}
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/recipes/${recipe.id}`} className={styles.viewButton}>
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  )
}
