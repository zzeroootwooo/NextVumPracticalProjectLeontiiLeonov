import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import RecipeCard from '@/components/RecipeCard'
import { Recipe } from '@/types'
import styles from './page.module.css'

export default async function RecipesPage() {
  const session = await auth()

  const recipes = await prisma.recipe.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  }) as Recipe[]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Recipes</h1>
        {session && (
          <Link href="/recipes/new" className={styles.createButton}>
            <span>+</span>
            <span>Create Recipe</span>
          </Link>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📝</div>
          <h2 className={styles.emptyTitle}>No recipes yet</h2>
          <p className={styles.emptyText}>
            Be the first to share a delicious recipe with the community!
          </p>
          {session && (
            <Link href="/recipes/new" className={styles.createButton}>
              Create First Recipe
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
