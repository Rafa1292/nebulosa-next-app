'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteArticleModifierGroup = async (id: string) => {
  try {
    const itemPrice = await prisma.articleModifierGroup.delete({
      where: {
        id: id,
      },
      select: {
        articleId: true,
      },
    })
    revalidatePath(`/admin/articles/${itemPrice.articleId}`)

    return {
      ok: true,
      message: 'Grupo eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar grupo',
    }
  }
}
