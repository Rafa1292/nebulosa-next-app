'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const inputSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  expectedPrice: z.coerce.number(),
  stock: z.coerce.number(),
  presentation: z.coerce.number(),
  inputCategoryId: z.string(),
  measureSlug: z.string(),
  currentProviderId: z.string().optional().default(''),
})

export const createUpdateInput = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = inputSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...input } = parse.data

    if (id) {
      // update
      await prisma.input.update({
        where: {
          id,
        },
        data: input,
      })
    } else {
      // create
      await prisma.input.create({
        data: input,
      })
    }
    revalidatePath(`/admin/inputs`)

    return {
      ok: true,
      message: 'Insumo creado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
