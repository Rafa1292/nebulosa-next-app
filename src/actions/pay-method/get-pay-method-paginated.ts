'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedPayMethods = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const payMethods = await prisma.payMethod.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalPayMethods = await prisma.payMethod.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalPayMethods / take),
      payMethods: payMethods ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las formas de pago',
    }
  }
}
