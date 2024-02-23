'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteProviderInput = async (id: string) => {
  try {
    const providerInput = await prisma.providerInput.delete({
      where: {
        id: id,
      },
      select: {
        providerId: true,
      },
    })
    revalidatePath(`/admin/providers/${providerInput.providerId}`)

    return {
      ok: true,
      message: 'Insumo eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar insumo',
    }
  }
}
