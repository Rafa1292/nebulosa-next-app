'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteBrand = async (id: string) => {
  try {
    await prisma.brand.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/brands`)

    return {
      ok: true,
      message: 'Marca eliminada',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar la marca',
    }
  }
}
