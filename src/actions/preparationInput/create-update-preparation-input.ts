'use server'

import { PreparationInput } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const preparationInputSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  preparationId: z.string(),
  inputId: z.string(),
  quantity: z.coerce.number(),
  measureSlug: z.string()
})
//get a parameter of type PreparationInput and a transaction

export const createUpdatePreparationInput = async (data: PreparationInput) => {
  try {
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
    console.log('error', error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}

