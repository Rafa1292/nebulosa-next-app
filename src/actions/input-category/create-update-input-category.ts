'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const inputCategorySchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string()
})

export const createUpdateInputCategory = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = inputCategorySchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...inputCategory } = parse.data

    if (id) {
      // update
      await prisma.inputCategory.update({
        where: {
          id,
        },
        data: inputCategory,
      })
    } else {
      // create
      await prisma.inputCategory.create({
        data: inputCategory,
      })
    }
    revalidatePath(`/admin/input-categories`)

    return {
      ok: true,
      message: 'Categoria creada',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
