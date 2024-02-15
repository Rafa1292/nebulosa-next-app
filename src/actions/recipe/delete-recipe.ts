'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteRecipe = async (id: string, articleId: string) => {
  try {
    await prisma.recipe.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/articles/${articleId}/recipes`)

    return {
      ok: true,
      message: 'Receta eliminada',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar receta',
    }
  }
}
