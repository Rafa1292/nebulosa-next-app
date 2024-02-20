'use server'

import prisma from '@/lib/prisma'

export const getSaleItems = async () => {
  try {
    const saleItems = await prisma.saleItem.findMany({
    })

    return {
      ok: true,
      saleItems: saleItems ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los items',
    }
  }
}
