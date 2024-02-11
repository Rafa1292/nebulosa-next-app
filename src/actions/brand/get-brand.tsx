'use server'

import prisma from '@/lib/prisma'

export const getBrandById = async (id: string) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      brand,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la marca',
    }
  }
}
