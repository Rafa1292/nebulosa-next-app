'use server'

import prisma from '@/lib/prisma'

export const getRecipeById = async (id: string)=> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id
      },
      include: {
        RecipePreparation: {
          include: {
            preparation: true,
          },
        },
        RecipeInput: {
          include: {
            input: true,
          },
        },
      },
    })
    return {
      ok: true,
      recipe,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la receta',
    }
  }
}
