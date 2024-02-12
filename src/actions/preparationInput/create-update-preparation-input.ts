'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const preparationInputSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  preparationId: z.string(),
  inputId: z.string(),
  cost: z.coerce.number(),
  quantity: z.coerce.number(),
  measureSlug: z.string()
})

export const createUpdatePreparationInput = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = preparationInputSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...preparationInput } = parse.data

    if (id) {
      // update
      await prisma.preparationInput.update({
        where: {
          id,
        },
        data: preparationInput,
      })
    } else {
      // create
      await prisma.preparationInput.create({
        data: preparationInput,
      })
    }
    revalidatePath(`/admin/preparations`)
    revalidatePath(`/admin/inputs`)

    return {
      ok: true,
      message: 'Insumo de preparacion creado',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
