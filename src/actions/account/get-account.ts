'use server'

import prisma from '@/lib/prisma'

export const getAccountById = async (id: string) => {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      account,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la cuenta',
    }
  }
}
