'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteSaleItemCategory = async (id: string) => {
  try {
    await prisma.saleItemCategory.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/sale-item-categories`)

    return {
      ok: true,
      message: 'Categoria eliminada',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar la categoria',
    }
  }
}
