'use server'

import prisma from '@/lib/prisma'

export const getCustomerById = async (id: string) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id,
      },
      include: {
        addresses: true,
      },
    })
    return {
      ok: true,
      customer,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el cliente',
    }
  }
}
