'use server'

import prisma from '@/lib/prisma'

export const getPayMethodById = async (id: string) => {
  try {
    const payMethod = await prisma.payMethod.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      payMethod,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la forma de pago',
    }
  }
}
