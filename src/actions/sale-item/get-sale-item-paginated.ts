'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedSaleItems = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const saleItems = await prisma.saleItem.findMany({
      include: {
        prices: true,
      },
      take: take,
      skip: (page - 1) * take,
    })

    const totalSaleItems = await prisma.saleItem.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalSaleItems / take),
      saleItems: saleItems ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los items',
    }
  }
}
