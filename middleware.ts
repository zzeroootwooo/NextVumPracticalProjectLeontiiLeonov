export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    "/recipes/new",
    "/recipes/:id/edit"
  ]
}
