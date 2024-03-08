'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteArticleModifierPrice = async (id: string, articleId: string) => {
  try {
    await prisma.articleModifierPrice.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/articulos/${articleId}`)

    return {
      ok: true,
      message: 'Precio eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar precio',
    }
  }
}
