'use server'

import { Budget } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const budgetSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  month: z.coerce.number().int().positive(),
  year: z.coerce.number().int().positive(),
  inventoryPercentage: z.coerce.number().int().positive(),
  expectedProfit: z.coerce.number().int().positive(),
  fixedExpense: z.coerce.number().int().positive()
})

const getGoal = (expectedProfit: number, inventoryPercentage: number, fixedExpense:number) => {
  const inventoryDiference = (100 - inventoryPercentage)/100
  const  basicExpenseAndProfit = expectedProfit + fixedExpense
  return Math.ceil(basicExpenseAndProfit / inventoryDiference)
}

const getBreakPoint = (inventoryPercentage: number, fixedExpense:number) => {
  const inventoryDiference = (100 - inventoryPercentage)/100
  return Math.ceil(fixedExpense / inventoryDiference)
}

export const createUpdateBudget = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = budgetSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...budget } = parse.data
    const newBudget = {
      ...budget,
      goal:getGoal(budget.expectedProfit, budget.inventoryPercentage, budget.fixedExpense),
      lowerGoal:getBreakPoint(budget.inventoryPercentage, budget.fixedExpense),
      upperGoal:getGoal(budget.expectedProfit, budget.inventoryPercentage, budget.fixedExpense) * 1.2,      
    }

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
          data: newBudget,
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
          data: newBudget,
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
