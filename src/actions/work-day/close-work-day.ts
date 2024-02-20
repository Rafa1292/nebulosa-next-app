'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const workDaySchema = z.object({
    id: z.string().uuid(),
  finalCashCash: z.coerce.number().positive(),
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
    await prisma.workDay.update({
        where: {
            id: payload.id
        },
      data:{
        finalCash: payload.finalCashCash,
        closed: true,
        // ToDo - calculate sales, expenses and diference
        // sales: 0,
        // expenses: 0,
        // diference: 0,
      }
    })

    revalidatePath(`/admin/work-days`)

    return {
      ok: true,
      message: 'Jornada cerrada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
