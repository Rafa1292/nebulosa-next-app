'use server'

import prisma from '@/lib/prisma'

export const getSaleItemCategories = async () => {
  try {
    const saleItemCategories = await prisma.saleItemCategory.findMany({
    })

    return {
      ok: true,
      saleItemCategories: saleItemCategories ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las categorias',
    }
  }
}
