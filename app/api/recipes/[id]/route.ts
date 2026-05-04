import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET single recipe
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    })

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      )
    }

    const isOwner = session?.user?.id === recipe.userId

    if (!recipe.isPublic && !isOwner) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    )
  }
}

// PUT update recipe
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const recipe = await prisma.recipe.findUnique({
      where: { id }
    })

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      )
    }

    // Check ownership
    if (recipe.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own recipes" },
        { status: 403 }
      )
    }

    const { title, description, ingredients, instructions, cookingTime, isPublic } = await request.json()
    const parsedCookingTime = Number.parseInt(String(cookingTime), 10)

    // Validation
    if (!title || !description || !ingredients || !instructions || !cookingTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    if (Number.isNaN(parsedCookingTime) || parsedCookingTime < 1) {
      return NextResponse.json(
        { error: "Cooking time must be at least 1 minute" },
        { status: 400 }
      )
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        ingredients,
        instructions,
        cookingTime: parsedCookingTime,
        isPublic: Boolean(isPublic)
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

    return NextResponse.json(updatedRecipe)
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    )
  }
}

// DELETE recipe
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const recipe = await prisma.recipe.findUnique({
      where: { id }
    })

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      )
    }

    // Check ownership
    if (recipe.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own recipes" },
        { status: 403 }
      )
    }

    await prisma.recipe.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    )
  }
}
