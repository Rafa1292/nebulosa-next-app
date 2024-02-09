'use server'

import prisma from '@/lib/prisma'

export const getInputById = async (id: string) => {
  try {
    const input = await prisma.input.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      input
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el insumo',
    }
  }
}
