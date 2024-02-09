'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedInputs = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const inputs = await prisma.input.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalInputs = await prisma.input.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalInputs / take),
      inputs: inputs ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los insumos',
    }
  }
}
