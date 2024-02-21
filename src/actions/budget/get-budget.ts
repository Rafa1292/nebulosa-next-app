'use server'

import prisma from '@/lib/prisma'

export const getBudgetById = async (id: string) => {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      budget,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el presupuesto',
    }
  }
}
