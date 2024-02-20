'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const workDaySchema = z.object({
  initialCash: z.coerce.number().positive(),
})

export const createWorkDay = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = workDaySchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const payload = parse.data
    // create
    await prisma.workDay.create({
      data:{
        initialCash: payload.initialCash,
        date: new Date(),
        closed: false,
        sales: 0,
        expenses: 0,
        diference: 0,
        finalCash: 0
      }
    })

    revalidatePath(`/admin/work-days`)

    return {
      ok: true,
      message: 'Jornada creada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
