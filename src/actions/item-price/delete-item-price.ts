'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteItemPrice = async (id: string) => {
  try {
    const itemPrice = await prisma.itemPrice.delete({
      where: {
        id: id,
      },
      select: {
        saleItemId: true,
      },
    })
    revalidatePath(`/admin/sale-items/${itemPrice.saleItemId}`)

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
