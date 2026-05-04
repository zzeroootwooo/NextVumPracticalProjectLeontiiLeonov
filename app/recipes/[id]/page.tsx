import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Button from '@/components/Button'
import DeleteButton from '@/components/DeleteButton'
import { Recipe } from '@/types'
import styles from './page.module.css'

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  }) as Recipe | null

  if (!recipe) {
    notFound()
  }

  const isOwner = session?.user?.id === recipe.userId

  if (!recipe.isPublic && !isOwner) {
    notFound()
  }

  const backHref = isOwner ? '/recipes' : '/community'

  if (!recipe) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>🔍</div>
          <h1 className={styles.notFoundTitle}>Recipe Not Found</h1>
          <p className={styles.notFoundText}>
            The recipe you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link href="/recipes">
            <Button>Back to Recipes</Button>
          </Link>
        </div>
      </div>
    )
  }
  const ingredients = recipe.ingredients.split('\n').filter(line => line.trim())

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Link href={backHref} className={styles.backButton}>
            ← Back to {isOwner ? 'my recipes' : 'community recipes'}
          </Link>
          <h1 className={styles.title}>{recipe.title}</h1>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span>👤</span>
              <span>by {recipe.user?.name}</span>
            </div>
            <div className={styles.metaItem}>
              <span>⏱️</span>
              <span>{recipe.cookingTime} minutes</span>
            </div>
            <div className={styles.metaItem}>
              <span>📅</span>
              <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.metaItem}>
              <span>{recipe.isPublic ? '🌍' : '🔒'}</span>
              <span>{recipe.isPublic ? 'Public' : 'Private'}</span>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          {isOwner && (
            <div className={styles.actions}>
              <Link href={`/recipes/${recipe.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <DeleteButton recipeId={recipe.id} recipeTitle={recipe.title} />
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span>📝</span>
              Description
            </h2>
            <p className={styles.description}>{recipe.description}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span>🛒</span>
              Ingredients
            </h2>
            <ul className={styles.list}>
              {ingredients.map((ingredient, index) => (
                <li key={index} className={styles.listItem}>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span>👨‍🍳</span>
              Instructions
            </h2>
            <p className={styles.instructions}>{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
