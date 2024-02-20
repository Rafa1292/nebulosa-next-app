'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedBrands = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const brands = await prisma.brand.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalBrands = await prisma.brand.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalBrands / take),
      brands: brands ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las marcas',
    }
  }
}
