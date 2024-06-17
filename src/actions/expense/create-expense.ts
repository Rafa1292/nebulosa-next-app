'use server'

import { auth } from '@/auth.config'
import { Expense } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getWorkDayByEmail } from '../work-day/get-work-day-by-email'
import { createExpenseAccountHistory } from '../expense-account-history/create-expense-account-history'

const accountHistorySchema = z.object({
  id: z.string().default(''),
  amount: z.number(),
  previousBalance: z.number(),
  currentBalance: z.number(),
  pay: z.boolean(),
  payMethodId: z.string(),
})

const expenseAccountHistorySchema = z.object({
  accountHistory: accountHistorySchema,
})

const expenseSchema = z.object({
  amount: z.number(),
  isNull: z.boolean(),
  description: z.string(),
  providerId: z.string().uuid(),
  pendingPay: z.boolean(),
  expenseAccountHistories: z.array(expenseAccountHistorySchema),
})

export const createExpense = async (expense: Partial<Expense>) => {
  try {
    const session = await auth()
    if (!session) {
      return {
        ok: false,
        message: 'No se pudo obtener la sesión',
      }
    }
    const { workDay } = await getWorkDayByEmail(session.user.email)
    if (!workDay) {
      return {
        ok: false,
        message: 'No se encontró la jornada laboral',
      }
    }
    const { expenseAccountHistories, ...validExpense } = expenseSchema.parse(expense)
    // init transaction
    await prisma.$transaction(
      async (tx) => {
        //create expense
        const createdExpense = await tx.expense.create({
          data: {
            workDayId: workDay.id,
            ...validExpense,
          },
        })

        if (!validExpense.pendingPay) {
          const tmpExpenseAccountHistories = expenseAccountHistories.map((expenseAccountHistory) => {
            return {
              ...expenseAccountHistory,
              expenseId: createdExpense.id,
            }
          })
          //create expenseAccountHistories
          const resp = await createExpenseAccountHistory(tmpExpenseAccountHistories, tx)

          if (!resp.ok) {
            throw new Error(resp.message)
          }
        }
      },
      { timeout: 1000000 }
    )
    console.log('Gasto creado')
    return {
      ok: true,
      message: 'Gasto creado',
    }
  } catch (error: any) {
    console.log(error)
    return {
      ok: false,
      message: error.message,
    }
  }
}
