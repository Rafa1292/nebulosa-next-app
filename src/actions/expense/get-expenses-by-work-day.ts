'use server'

import prisma from '@/lib/prisma'

export const getExpensesByWorkDay = async (workDayId: string) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: {
        workDayId,
      },
    })

    return {
      ok: true,
      entries: expenses,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener los gastos del día de trabajo',
    }
  }
}
