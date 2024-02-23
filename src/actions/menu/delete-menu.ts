'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteMenu = async (id: string) => {
  try {
    await prisma.menu.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/menus`)

    return {
      ok: true,
      message: 'Menu eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar menu',
    }
  }
}
