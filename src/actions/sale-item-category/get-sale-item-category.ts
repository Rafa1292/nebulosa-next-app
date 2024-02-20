'use server'

import prisma from '@/lib/prisma'

export const getSaleItemCategoryById = async (id: string) => {
  try {
    const saleItemCategory = await prisma.saleItemCategory.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      saleItemCategory,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la categoria',
    }
  }
}
