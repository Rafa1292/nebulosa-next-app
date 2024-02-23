'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteModifierGroup = async (id: string) => {
  try {
    await prisma.modifierGroup.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/modifier-groups`)

    return {
      ok: true,
      message: 'Grupo eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar grupo',
    }
  }
}
