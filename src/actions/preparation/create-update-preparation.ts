'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const preparationSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  cost: z.coerce.number(),
  presentation: z.coerce.number(),
  price: z.coerce.number()
})

export const createUpdatePreparation = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = preparationSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...preparation } = parse.data

    if (id) {
      // update
      await prisma.preparation.update({
        where: {
          id,
        },
        data: preparation,
      })
    } else {
      // create
      await prisma.preparation.create({
        data: preparation,
      })
    }
    revalidatePath(`/admin/preparations`)

    return {
      ok: true,
      message: 'Preparacion creada',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
