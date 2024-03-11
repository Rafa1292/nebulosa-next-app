'use server'

import { ArticleModifierGroup } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createUpdateArticleModifierPrice } from '..'

const articleModifierPriceSchema = z.object({
  id: z.string().optional(),
  menuId: z.string().uuid(),
  articleModifierId: z.string().optional(),
  price: z.number().int().positive(),
})

const articleModifierSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  articleId: z.string().uuid(),
  modifierGroupId: z.string().uuid(),
  order: z.coerce.number().int(),
  minSelect: z.coerce.number().int(),
  maxSelect: z.coerce.number().int(),
  priceByGroup: z.boolean(),
  prices: z.array(articleModifierPriceSchema).optional(),
})

export const createUpdateArticleModifierGroup = async (data: ArticleModifierGroup, articleId: string) => {
  try {
    console.log(data)
    const parse = articleModifierSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, prices, ...articleModifierGroup } = parse.data
    await prisma.$transaction(async (tx) => {
      if (id) {
        // update
        await tx.articleModifierGroup.update({
          where: {
            id,
          },
          data: articleModifierGroup,
        })
        //update-create-prices
        if (prices) {
          for (const price of prices) {
            const articleModifierPriceId = price.id === '' ? undefined : price.id
            const { ok, message } = await createUpdateArticleModifierPrice(
              { ...price, id: articleModifierPriceId, articleModifierId: id },
              articleId,
              tx
            )
            if (!ok) {
              throw new Error(message)
            }
          }
        }
      } else {
        // create
        const {id:newId} = await tx.articleModifierGroup.create({
          data: articleModifierGroup,
        })
        //update-create-prices
        if (prices) {
          for (const price of prices) {
            const { ok, message } = await createUpdateArticleModifierPrice({ ...price, id: undefined, articleModifierId: newId },
              articleId,
              tx)
            if (!ok) {
              throw new Error(message)
            }
          }
        }
      }
    })
    revalidatePath(`/admin/articles/${articleId}`)

    return {
      ok: true,
      message: 'Grupo agregado',
    }
  } catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}
