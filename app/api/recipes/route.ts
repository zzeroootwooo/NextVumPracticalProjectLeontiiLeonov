import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all recipes
export async function GET() {
  try {
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
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    )
  }
}

// POST create new recipe
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, description, ingredients, instructions, cookingTime } = await request.json()

    // Validation
    if (!title || !description || !ingredients || !instructions || !cookingTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (cookingTime < 1) {
      return NextResponse.json(
        { error: "Cooking time must be at least 1 minute" },
        { status: 400 }
      )
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        ingredients,
        instructions,
        cookingTime: parseInt(cookingTime),
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
      }
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error("Error creating recipe:", error)
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    )
  }
}
