'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteRecipePreparation = async (id: string, articleId: string) => {
  try {
    await prisma.recipePreparation.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/articles/${articleId}/recipes`)
    revalidatePath(`/admin/inputs`)

    return {
      ok: true,
      message: 'Preparacion de receta eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar preparacion de receta',
    }
  }
}
