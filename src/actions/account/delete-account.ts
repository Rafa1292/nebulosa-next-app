'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteAccount = async (id: string) => {
  try {
    await prisma.account.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/accounts`)

    return {
      ok: true,
      message: 'Cuenta eliminada',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar la cuenta',
    }
  }
}
