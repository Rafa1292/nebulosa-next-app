'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedWorkDays = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const workDays = await prisma.workDay.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalWorkDays = await prisma.workDay.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalWorkDays / take),
      workDays: workDays ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las jornadas',
    }
  }
}
