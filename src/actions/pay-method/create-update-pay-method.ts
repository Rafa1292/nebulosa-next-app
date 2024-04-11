'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'


const payMethodSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  accountId:  z.string(),
  active: z.string().transform((val) => (val === 'true' ? true : false)),
  commission: z.coerce.number(),
  isPublic: z.string().transform((val) => (val === 'true' ? true : false)),
  isSemiPublic: z.string().transform((val) => (val === 'true' ? true : false))
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
