'use server'

import prisma from '@/lib/prisma'

export const getRecipeByArticleId = async (articleId: string)=> {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        articleId
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
