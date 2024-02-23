'use server'

import prisma from '@/lib/prisma'

export const getMenus = async () => {
  try {
    const menus = await prisma.menu.findMany({ })

    return {
      ok: true,
      menus: menus ?? [],
    }

  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los menus',
    }
  }
}
