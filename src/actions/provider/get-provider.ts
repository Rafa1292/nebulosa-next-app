'use server'

import prisma from '@/lib/prisma'

export const getProviderById = async (id: string) => {
  console.log('getProviderById', id)
  try {
    const provider = await prisma.provider.findUnique({
      where: {
        id,
      },
    })
    console.log('provider', provider)
    return {
      ok: true,
      inputCategory: provider,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el proveedor',
    }
  }
}
