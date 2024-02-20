'use server'

import { SaleItemArticle } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const saleItemArticleSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  saleItemId: z.string(),
  articleId: z.string(),
  quantity: z.coerce.number()
})

export const createUpdateSaleItemArticle = async (data: SaleItemArticle, saleItemId: string) => {
  try {
    const parse = saleItemArticleSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...saleItemArticle } = parse.data

    if (id) {
      // update
      await prisma.saleItemArticle.update({
        where: {
          id,
        },
        data: saleItemArticle,
      })
    } else {
      // create
      await prisma.saleItemArticle.create({
        data: saleItemArticle,
      })
    }
    revalidatePath(`/admin/sale-items/${saleItemId}`)

    return {
      ok: true,
      message: 'Articulo de item creado',
    }

  } catch (error: any) {
    console.log('error', error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}

