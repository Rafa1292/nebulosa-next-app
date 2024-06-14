'use server'

import prisma from '@/lib/prisma'


export const getProviders = async () => {
  try {
    const providers = await prisma.provider.findMany()

    return {
      ok: true,
      providers: providers ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los proveedores',
    }
  }
}
