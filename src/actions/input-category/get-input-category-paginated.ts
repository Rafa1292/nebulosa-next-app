'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedInputCategories = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const inputCategories = await prisma.inputCategory.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalInputCategories = await prisma.inputCategory.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalInputCategories / take),
      inputCategories: inputCategories ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las categorias',
    }
  }
}
