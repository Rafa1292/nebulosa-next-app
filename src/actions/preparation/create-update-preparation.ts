'use server'

import { PreparationInput } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createUpdatePreparationInput } from '..'

const preparationInputSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  preparationId: z.string(),
  inputId: z.string(),
  cost: z.coerce.number(),
  quantity: z.coerce.number(),
  measureSlug: z.string(),
})

const preparationSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  cost: z.coerce.number(),
  presentation: z.coerce.number(),
  measureSlug: z.string(),
})

export const createUpdatePreparation = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = preparationSchema.safeParse(data)

    if (!parse.success) {
      throw new Error(parse.error.message)
    }

    let preparationId = ''
    await prisma.$transaction(async (tx) => {
      const { id, ...preparation } = parse.data

      if (id !== null && id !== undefined) {
        // update
        const { id: updatedId } = await tx.preparation.update({
          where: {
            id,
          },
          data: preparation,
        })
        preparationId = updatedId
      } else {
        // create
        const { id: createdId } = await tx.preparation.create({
          data: preparation,
        })
        preparationId = createdId
      }
    })

    revalidatePath(`/admin/preparations`)
    return {
      ok: true,
      message: 'Preparacion creada',
      preparationId,
    }
  } catch (error: any) {
    console.log(error)
    return {
      ok: false,
      message: error.message,
    }
  }
}
