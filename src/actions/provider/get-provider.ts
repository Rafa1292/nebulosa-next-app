'use server'

import prisma from '@/lib/prisma'

export const getProviderById = async (id: string) => {
  try {
    const provider = await prisma.provider.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      provider,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el proveedor',
    }
  }
}
