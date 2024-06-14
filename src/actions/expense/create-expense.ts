'use server'

import {  Expense } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const accountHistorySchema = z.object({
  amount: z.number(),
  previousBalance: z.number(),
  currentBalance: z.number(),
  pay: z.boolean(),
  payMethodId: z.string(),
})


const expenseSchema = z.object({
    amount: z.number(),
    isNull: z.boolean(),
    description: z.string(),
    providerId: z.string().uuid(),    
    workDayId: z.string().uuid(),
    pendingPay: z.boolean(),
    expenseAccountHistories: z.array(accountHistorySchema),
})

export const createExpense = async (expense: Partial<Expense>) => {
  try {
    const { expenseAccountHistories, ...validExpense} = expenseSchema.parse(expense)
    await prisma.expense.create({
      data: {
        ...validExpense,
        },
    })
    
    return {
      ok: true,
      message: 'Gasto creado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
