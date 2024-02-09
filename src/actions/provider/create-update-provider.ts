'use server'

import { Route } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const providerSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  route: z.coerce.string().transform((val) => val.split(',') as Route[]),
  fixedExpense: z.string().transform((val) => (val === 'true' ? true : false)),
})

export const createUpdateProvider = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = providerSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...provider } = parse.data

    if (id) {
      // update
      await prisma.provider.update({
        where: {
          id,
        },
        data: provider,
      })
    } else {
      // create
      await prisma.provider.create({
        data: provider,
      })
    }
    revalidatePath(`/admin/providers`)

    return {
      ok: true,
      message: 'Proveedor creado',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
