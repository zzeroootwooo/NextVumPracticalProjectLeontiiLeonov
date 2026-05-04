import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import Button from '@/components/Button'
import NavLinks from './NavLinks'
import styles from './Navbar.module.css'

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          RecipeApp
        </Link>

        <div className={styles.nav}>
          <NavLinks isAuthenticated={Boolean(session)} />

          {session ? (
            <>
              <div className={styles.user}>
                <span className={styles.userName}>Hello, {session.user?.name}</span>
                <form
                  action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/login' })
                  }}
                >
                  <Button type="submit" variant="secondary">
                    Logout
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.link}>
                Login
              </Link>
              <Link href="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
