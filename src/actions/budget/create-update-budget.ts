'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const budgetSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  goal: z.coerce.number().int().positive(),
  upperGoal: z.coerce.number().int().positive(),
  lowerGoal: z.coerce.number().int().positive(),
  month: z.coerce.number().int().positive(),
  year: z.coerce.number().int().positive(),
  fixedExpense: z.coerce.number().int().positive(),
  inventoryPercentage: z.coerce.number().int().positive(),
  expectedProfit: z.coerce.number().int().positive(),
})

export const createUpdateBudget = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = budgetSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...budget } = parse.data

    if (id) {
      // update
      const actualBudget = await prisma.budget.findFirst({
        where: {
          month: budget.month,
          year: budget.year,
        },
      })
      if (actualBudget && actualBudget.id !== id) {
        throw new Error('Ya existe un presupuesto para este mes y año')
      } else {
        await prisma.budget.update({
          where: {
            id,
          },
          data: budget,
        })
      }
    } else {
      // create
      //get actual budget
      const actualBudget = await prisma.budget.findFirst({
        where: {
          month: budget.month,
          year: budget.year,
        },
      })
      if (actualBudget) {
        throw new Error('Ya existe un presupuesto para este mes y año')
      } else {
        await prisma.budget.create({
          data: budget,
        })
      }
    }
    revalidatePath(`/admin/budgets`)

    return {
      ok: true,
      message: 'Presupuesto creada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
