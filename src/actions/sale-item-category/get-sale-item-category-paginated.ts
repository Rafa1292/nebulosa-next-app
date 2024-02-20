'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedSaleItemCategories = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const saleItemCategories = await prisma.saleItemCategory.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalSaleItemCategories = await prisma.saleItemCategory.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalSaleItemCategories / take),
      saleItemCategories: saleItemCategories ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las categorias',
    }
  }
}
