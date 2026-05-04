'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

interface NavLinksProps {
  isAuthenticated: boolean
}

export default function NavLinks({ isAuthenticated }: NavLinksProps) {
  const pathname = usePathname()

  const isRecipesActive = pathname.startsWith('/recipes')
  const isCommunityActive = pathname.startsWith('/community')

  return (
    <div className={styles.routeButtons}>
      {isAuthenticated && (
        <Link
          href="/recipes"
          className={`${styles.navButton} ${isRecipesActive ? styles.navButtonActive : styles.navButtonMuted}`}
        >
          <span className={styles.navButtonIcon}>📚</span>
          <span>My Recipes</span>
        </Link>
      )}
      <Link
        href="/community"
        className={`${styles.navButton} ${isCommunityActive ? styles.navButtonActive : styles.navButtonMuted}`}
      >
        <span className={styles.navButtonIcon}>🌍</span>
        <span>Community</span>
      </Link>
    </div>
  )
}
