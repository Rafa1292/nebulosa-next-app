'use server'

import prisma from '@/lib/prisma'

export const getAccounts = async () => {
  try {
    const accounts = await prisma.account.findMany({})

    return {
      ok: true,
      accounts: accounts ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las cuentas',
    }
  }
}
