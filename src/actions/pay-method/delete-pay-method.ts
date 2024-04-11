'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deletePayMethod = async (id: string) => {
  try {
    await prisma.payMethod.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/pay-methods`)

    return {
      ok: true,
      message: 'Forma de pago eliminada',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar la forma de pago',
    }
  }
}
