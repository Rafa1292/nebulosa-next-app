'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteSaleItem = async (id: string) => {
  try {
    //delete prices too
    await prisma.$transaction(async (tx) => {
      await tx.saleItemArticle.deleteMany({
        where: {
          saleItemId: id,
        },
      })
      await tx.itemPrice.deleteMany({
        where: {
          saleItemId: id,
        },
      })
      await tx.saleItem.delete({
        where: {
          id,
        },
      })
    })
    revalidatePath(`/admin/sale-items`)

    return {
      ok: true,
      message: 'Item eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar item',
    }
  }
}
