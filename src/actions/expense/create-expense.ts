'use server'

import {  Expense } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'


const expenseSchema = z.object({
    amount: z.number(),
    isNull: z.boolean(),
    description: z.string(),
    providerId: z.string().uuid(),    
    workDayId: z.string().uuid(),
    pendingPay: z.boolean()
})

export const createExpense = async (expense: Expense) => {
  try {
    const validExpense = expenseSchema.parse(expense)
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
