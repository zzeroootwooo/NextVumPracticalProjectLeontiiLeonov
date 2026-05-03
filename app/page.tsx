import Link from "next/link";
import { auth } from "@/lib/auth";
import styles from "./page.module.css";

export default async function Home() {
  const session = await auth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Welcome to RecipeApp</h1>
          <p className={styles.description}>
            Discover, create, and share your favorite recipes with the world.
            Join our community of food lovers and start your culinary journey today!
          </p>

          {session ? (
            <div className={styles.ctas}>
              <Link href="/recipes" className={styles.primary}>
                Browse Recipes
              </Link>
              <Link href="/recipes/new" className={styles.secondary}>
                Create Recipe
              </Link>
            </div>
          ) : (
            <div className={styles.ctas}>
              <Link href="/register" className={styles.primary}>
                Get Started
              </Link>
              <Link href="/login" className={styles.secondary}>
                Login
              </Link>
            </div>
          )}
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Create & Share</h3>
            <p>Share your favorite recipes with the community</p>
          </div>
          <div className={styles.feature}>
            <h3>Discover</h3>
            <p>Browse recipes from other food enthusiasts</p>
          </div>
          <div className={styles.feature}>
            <h3>Manage</h3>
            <p>Keep track of your personal recipe collection</p>
          </div>
        </div>
      </main>
    </div>
  );
}
