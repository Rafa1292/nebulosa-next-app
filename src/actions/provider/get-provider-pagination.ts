'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedProviders = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const providers = await prisma.provider.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalProviders = await prisma.provider.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalProviders / take),
      providers: providers ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los proveedores',
    }
  }
}
