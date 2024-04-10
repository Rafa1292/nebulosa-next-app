'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'


const accountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  active: z.boolean().optional(),
  cash: z.boolean().optional(),
})

export const createUpdateAccount = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = accountSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...account } = parse.data

    if (id) {
      // update
      await prisma.account.update({
        where: {
          id,
        },
        data: account,
      })
    } else {
      // create
      await prisma.account.create({
        data: account,
      })
    }
    revalidatePath(`/admin/accounts`)

    return {
      ok: true,
      message: 'Cuenta creada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
