import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import RecipeCard from '@/components/RecipeCard'
import { Recipe } from '@/types'
import styles from '../recipes/page.module.css'

export default async function CommunityPage() {
  const recipes = await prisma.recipe.findMany({
    where: {
      isPublic: true
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Community Recipes</h1>
          <p className={styles.subtitle}>Public recipes shared by everyone in the app.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/recipes/new" className={styles.createButton}>
            <span>+</span>
            <span>Create Recipe</span>
          </Link>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🌍</div>
          <h2 className={styles.emptyTitle}>No public recipes yet</h2>
          <p className={styles.emptyText}>
            The community feed is empty right now. Publish one of your recipes to make it visible here.
          </p>
          <Link href="/recipes/new" className={styles.createButton}>
            Create Public Recipe
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
