'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedMenus = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const menus = await prisma.menu.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalMenus = await prisma.menu.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalMenus / take),
      menus: menus ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los menus',
    }
  }
}
