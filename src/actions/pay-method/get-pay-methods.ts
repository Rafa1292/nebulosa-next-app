'use server'

import prisma from '@/lib/prisma'


export const getPayMethods = async () => {
  try {
    const payMethods = await prisma.payMethod.findMany({
    })


    return {
      ok: true,
      payMethods: payMethods ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las formas de pago',
    }
  }
}
