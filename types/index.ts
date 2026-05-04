export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string
  instructions: string
  cookingTime: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
  user?: User
}

export interface RecipeFormData {
  title: string
  description: string
  ingredients: string
  instructions: string
  cookingTime: number | string
  isPublic: boolean
}
