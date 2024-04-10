'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedAccounts = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const accounts = await prisma.account.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalaccounts = await prisma.account.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalaccounts / take),
      accounts: accounts ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las cuentas',
    }
  }
}
