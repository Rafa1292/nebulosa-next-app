'use server'

import { ExpenseAccountHistory } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const accountHistorySchema = z.object({
  amount: z.number(),
  previousBalance: z.number(),
  currentBalance: z.number(),
  pay: z.boolean(),
  payMethodId: z.string(),
})

const expenseAccountHistorySchema = z.object({
  expenseId: z.string().uuid(),
  accountHistory: accountHistorySchema
})

const expenseAccountHistoriesSchema = z.array(expenseAccountHistorySchema)

export const createExpenseAccountHistory = async (expenseAccountHistories: Partial<ExpenseAccountHistory>[], tx: any) => {
  try {
    const parse = expenseAccountHistoriesSchema.safeParse(expenseAccountHistories)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const data = parse.data
    for (const expenseAccountHistory of data) {
      const createdAccountHistory = await tx.accountHistory.create({
        data: {
          ...expenseAccountHistory.accountHistory,
        },
      })
      const {accountHistory, ...billAccountHistoryData} = expenseAccountHistory
      await tx.expenseAccountHistory.create({
        data: {
          ...billAccountHistoryData,
          accountHistoryId: createdAccountHistory.id,
        },
      })
    }

    return {
      ok: true,
      message: 'Historial creado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
