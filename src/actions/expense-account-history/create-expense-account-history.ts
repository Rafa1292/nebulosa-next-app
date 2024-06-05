'use server'

import { ExpenseAccountHistory } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const expenseAccountHistorySchema = z.object({
  accountHistoryId: z.string().uuid(),
  expenseId: z.string().uuid(),
})

export const createExpenseAccountHistory = async (expenseAccountHistory: ExpenseAccountHistory) => {
  try {
    const { accountHistoryId, expenseId } = expenseAccountHistorySchema.parse(expenseAccountHistory)

    const createdExpenseAccountHistory = await prisma.expenseAccountHistory.create({
      data: {
        accountHistoryId,
        expenseId,
      },
    })

    return {
      ok: true,
      expenseAccountHistory: createdExpenseAccountHistory,
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
