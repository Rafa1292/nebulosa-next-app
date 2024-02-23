'use server'

import prisma from '@/lib/prisma'

export const getMenuById = async (id: string) => {
  try {
    const menu = await prisma.menu.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      menu,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la marca',
    }
  }
}
