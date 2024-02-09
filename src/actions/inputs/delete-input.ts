'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteInput = async (id: string) => {
  try {
    await prisma.input.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/inputs`)

    return {
      ok: true,
      message: 'Insumo eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar el insumo',
    }
  }
}
