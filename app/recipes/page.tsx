import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import RecipeCard from '@/components/RecipeCard'
import { Recipe } from '@/types'
import styles from './page.module.css'

export default async function RecipesPage() {
  const session = await auth()

  const recipes = session?.user?.id
    ? await prisma.recipe.findMany({
        where: {
          userId: session.user.id
        },
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
    : []

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>My Recipes</h1>
          <p className={styles.subtitle}>Your private collection and anything you choose to publish.</p>
        </div>
        <div className={styles.headerActions}>
          {session && (
            <Link href="/recipes/new" className={styles.createButton}>
              <span>+</span>
              <span>Create Recipe</span>
            </Link>
          )}
        </div>
      </div>

      {!session ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🔐</div>
          <h2 className={styles.emptyTitle}>Login to see your recipes</h2>
          <p className={styles.emptyText}>
            Private recipes are only visible in your account. You can still browse public ones in the community section.
          </p>
          <Link href="/login" className={styles.createButton}>
            Login
          </Link>
        </div>
      ) : recipes.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📝</div>
          <h2 className={styles.emptyTitle}>No personal recipes yet</h2>
          <p className={styles.emptyText}>
            Your new account starts empty. Create a private recipe first, or publish one to the community when you are ready.
          </p>
          <Link href="/recipes/new" className={styles.createButton}>
            Create First Recipe
          </Link>
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
