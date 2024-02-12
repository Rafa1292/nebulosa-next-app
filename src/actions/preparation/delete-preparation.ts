'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deletePreparation = async (id: string) => {
  try {
    await prisma.preparation.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/preparations`)

    return {
      ok: true,
      message: 'Preparacion eliminada',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar preparacion',
    }
  }
}
