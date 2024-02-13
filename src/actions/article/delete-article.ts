'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteArticle = async (id: string) => {
  try {
    await prisma.article.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/articles`)

    return {
      ok: true,
      message: 'Articulo eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar el articulo',
    }
  }
}
