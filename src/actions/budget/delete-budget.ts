'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const deleteBudget = async (id: string) => {
  try {
    await prisma.budget.delete({
      where: {
        id: id,
      },
    })
    revalidatePath(`/admin/budgets`)

    return {
      ok: true,
      message: 'Presupuesto eliminado',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al eliminar presupuesto',
    }
  }
}
