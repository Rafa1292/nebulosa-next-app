'use server'

import { RecipePreparation } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const recipePreparationSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  preparationId: z.string(),
  recipeId: z.string(),
  quantity: z.coerce.number(),
  measureSlug: z.string()
})

export const createUpdateRecipePreparation = async (data: RecipePreparation, articleId: string) => {
  try {
    const parse = recipePreparationSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...recipePreparation } = parse.data

    if (id) {
      // update
      await prisma.recipePreparation.update({
        where: {
          id,
        },
        data: recipePreparation,
      })
    } else {
      // create
      await prisma.recipePreparation.create({
        data: recipePreparation,
      })
    }
    console.log('created')
    revalidatePath(`/admin/articles/${articleId}/recipes`)

    return {
      ok: true,
      message: 'Preparacion de receta creada',
    }

  } catch (error: any) {
    console.log('error', error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}

