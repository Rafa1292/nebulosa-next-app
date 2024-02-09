'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteProvider = async (id: string) => {
  try {
    console.log('deleteProvider', id)
    await prisma.provider.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/providers`)

    return {
      ok: true,
      message: 'Proveedor eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar el proveedor',
    }
  }
}
