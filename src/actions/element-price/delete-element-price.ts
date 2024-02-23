'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteElementPrice = async (id: string) => {
  try {
    const elementPrice = await prisma.elementPrice.delete({
      where: {
        id: id,
      },
      select: {
        modifierElementId: true,
      },
    })
    revalidatePath(`/admin/modifier-elements/${elementPrice.modifierElementId}`)

    return {
      ok: true,
      message: 'Precio eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar precio',
    }
  }
}
