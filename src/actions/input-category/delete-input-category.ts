'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteInputCategory = async (id: string) => {
  try {
    await prisma.inputCategory.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/input-categories`)

    return {
      ok: true,
      message: 'Categoria eliminada',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar la categoria',
    }
  }
}
