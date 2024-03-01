'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedModifierGroups = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const modifierGroups = await prisma.modifierGroup.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalModifierGroups = await prisma.modifierGroup.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalModifierGroups / take),
      modifierGroups: modifierGroups ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los grupos',
    }
  }
}
