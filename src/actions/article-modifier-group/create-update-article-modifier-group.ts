'use server'

import { ArticleModifierGroup } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const articleModifierSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  articleId: z.string().uuid(),
  modifierGroupId: z.string().uuid(),
  order: z.number().int(),
  price: z.number().int(),
  minSelect: z.number().int(),
  maxSelect: z.number().int(),
  priceByGroup: z.boolean(),
})

export const createUpdateArticleModifierGroup = async (data: ArticleModifierGroup, articleId: string) => {
  try {
    const parse = articleModifierSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...articleModifierGroup } = parse.data

    if (id) {
      // update
      await prisma.articleModifierGroup.update({
        where: {
          id,
        },
        data: articleModifierGroup,
      })
    } else {
      // create
      await prisma.articleModifierGroup.create({
        data: articleModifierGroup,
      })
    }
    revalidatePath(`/admin/articles/${articleId}`)

    return {
      ok: true,
      message: 'Grupo agregado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
