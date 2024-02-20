'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deletePreparationInput = async (id: string) => {
  try {
    await prisma.preparationInput.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/preparations`)
    revalidatePath(`/admin/inputs`)

    return {
      ok: true,
      message: 'Insumo de preparacion eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar insumo de preparacion',
    }
  }
}
