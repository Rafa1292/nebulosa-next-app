'use server'

import prisma from '@/lib/prisma'

export const getRecipes = async ()=> {
  try {
    const recipes = await prisma.recipe.findMany({})

    return {
      ok: true,
      recipes,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la receta',
    }
  }
}
