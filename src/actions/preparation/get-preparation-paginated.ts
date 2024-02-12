'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedPreparations = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12

    const preparations = await prisma.preparation.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalPreparations = await prisma.preparation.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalPreparations / take),
      preparations: preparations ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las preparaciones',
    }
  }
}
