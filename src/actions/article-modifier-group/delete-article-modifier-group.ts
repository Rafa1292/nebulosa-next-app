'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteArticleModifierGroup = async (id: string) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.articleModifierPrice.deleteMany({
        where: {
          articleModifierId: id,
        },
      })
      const articleModifier = await tx.articleModifierGroup.delete({
        where: {
          id: id,
        },
        select: {
          articleId: true,
        },
      })
      revalidatePath(`/admin/articles/${articleModifier.articleId}`)
    })

    return {
      ok: true,
      message: 'Grupo eliminado',
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Error al eliminar grupo',
    }
  }
}
