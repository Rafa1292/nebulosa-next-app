'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteSaleItemArticle = async (id: string, saleItemId: string) => {
  try {
    await prisma.saleItemArticle.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/sale-items/${saleItemId}`)
    revalidatePath(`/admin/sale-items`)

    return {
      ok: true,
      message: 'Articulo de item eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar articulo de item',
    }
  }
}
