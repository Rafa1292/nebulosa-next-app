'use server'

import { RecipeInput } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const recipeInputSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  inputId: z.string(),
  recipeId: z.string(),
  quantity: z.coerce.number(),
  measureSlug: z.string()
})

export const createUpdateRecipeInput = async (data: RecipeInput, articleId: string) => {
  try {
    const parse = recipeInputSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...recipeInput } = parse.data

    if (id) {
      // update
      await prisma.recipeInput.update({
        where: {
          id,
        },
        data: recipeInput,
      })
    } else {
      // create
      await prisma.recipeInput.create({
        data: recipeInput,
      })
    }
    console.log('created')
    revalidatePath(`/admin/articles/${articleId}/recipes`)

    return {
      ok: true,
      message: 'Insumo de receta creado',
    }

  } catch (error: any) {
    console.log('error', error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}

