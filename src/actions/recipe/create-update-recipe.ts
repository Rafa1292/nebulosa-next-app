'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const recipeSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  cost: z.coerce.number(),
  articleId: z.string(),
})

export const createUpdateRecipe = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = recipeSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...recipe } = parse.data

    const currentRecipe = await prisma.recipe.findUnique({
      where: {
        articleId: recipe.articleId,
      },
    })

    if (currentRecipe) {
      throw new Error('Ya existe una receta para este artículo')
    }

    if (id) {
      // update
      await prisma.recipe.update({
        where: {
          id,
        },
        data: recipe,
      })
    } else {
      // create
      await prisma.recipe.create({
        data: recipe,
      })
    }
    revalidatePath(`/admin/articles/${recipe.articleId}/recipes`)

    return {
      ok: true,
      message: 'Receta creada',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
