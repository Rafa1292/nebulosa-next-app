'use server'

import prisma from '@/lib/prisma'

export const getSaleItemById = async (id: string) => {
  try {
    const saleItem = await prisma.saleItem.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      saleItem,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el item',
    }
  }
}
