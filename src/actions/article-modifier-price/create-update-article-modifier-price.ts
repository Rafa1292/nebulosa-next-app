'use server'

import { ArticleModifierPrice } from '@/interfaces'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const articleModifierPriceSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  menuId: z.string().uuid(),
  articleModifierId: z.string().uuid(),
  price: z.number().int().positive(),
})


export const createUpdateArticleModifierPrice = async (price: Partial<ArticleModifierPrice>, articleId: string, tx:any) => {
  try {
    console.log('aqui')
    const parse = articleModifierPriceSchema.safeParse(price)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...articleModifierPrice } = parse.data

    if (id) {
      // update
      await tx.articleModifierPrice.update({
        where: {
          id,
        },
        data: articleModifierPrice,
      })
    } else {
      // create
      await tx.articleModifierPrice.create({
        data: articleModifierPrice,
      })
    }
    console.log('ok')
    revalidatePath(`/admin/articles/${articleId}`)
    return {
      ok: true,
      message: 'Precio creado',
    }

  } catch (error: any) {
    console.log('error', error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}
