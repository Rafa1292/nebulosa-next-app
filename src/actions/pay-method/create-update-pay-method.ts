'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'


const payMethodSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  accountId:  z.string(),
  active: z.boolean().default(true),
  commission: z.number().int().default(0),
  isPublic: z.boolean().default(false),
  isSemiPublic: z.boolean().default(false)
})

export const createUpdatePayMethod = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = payMethodSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...payMethod } = parse.data

    if (id) {
      // update
      await prisma.payMethod.update({
        where: {
          id,
        },
        data: payMethod,
      })
    } else {
      // create
      await prisma.payMethod.create({
        data: payMethod,
      })
    }
    revalidatePath(`/admin/pay-methods`)

    return {
      ok: true,
      message: 'Forma de pago creada',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
