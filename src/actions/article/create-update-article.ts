'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const articleSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  description: z.string().optional(),
  needsCommand: z.boolean(),
  active: z.boolean()
})

export const createUpdateArticle = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = articleSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...article } = parse.data

    if (id) {
      // update
      await prisma.article.update({
        where: {
          id,
        },
        data: article,
      })
    } else {
      // create
      await prisma.article.create({
        data: article,
      })
    }
    revalidatePath(`/admin/recipes`)

    return {
      ok: true,
      message: 'Articulo creado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
