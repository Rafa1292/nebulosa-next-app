'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteModifierElement = async (id: string) => {
  try {
    const modifierElement = await prisma.modifierElement.delete({
      where: {
        id: id,
      },
      select: {
        modifierGroupId: true,
      },
    })
    revalidatePath(`/admin/modifier-groups/${modifierElement.modifierGroupId}`)

    return {
      ok: true,
      message: 'Elemento eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar elemento',
    }
  }
}
