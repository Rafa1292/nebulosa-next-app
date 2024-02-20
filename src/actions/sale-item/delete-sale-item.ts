'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteSaleItem = async (id: string) => {
  try {
    await prisma.saleItem.delete({
      where: {
        id: id,
      },
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
