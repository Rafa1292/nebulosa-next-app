'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createUpdateItemPrice } from '..'
import { ItemPrice } from '@/interfaces'

const itemPriceSchema = z.object({
  id: z.string().uuid().optional(),
  menuId: z.string().uuid(),
  saleItemId: z.string().uuid(),
  price: z.number().int().positive(),
})

const saleItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  saleItemCategoryId: z.string().uuid(),
  prices: z.coerce.string().transform((val) => JSON.parse(val) as ItemPrice[]).optional(),
})

export const createUpdateSaleItem = async (formData: FormData) => {
  try {
    await prisma.$transaction(async (tx) => {
      const data = Object.fromEntries(formData)
      const parse = saleItemSchema.safeParse(data)
      if (!parse.success) {
        throw new Error(parse.error.message)
      }
      const { id, prices, ...saleItem } = parse.data
      if (id) {
        // update
        await tx.saleItem.update({
          where: {
            id,
          },
          data: saleItem,
        })
        //update-create-prices
        if (prices) {
          for (const price of prices) {
            const itemPriceId = price.id === '' ? undefined : price.id
            const { ok, message } = await createUpdateItemPrice({ ...price, id: itemPriceId, saleItemId: id })
            if (!ok) {
              throw new Error(message)
            }
          }
        }
      } else {
        // create
        await tx.saleItem.create({
          data: saleItem,
        })
      }
      revalidatePath(`/admin/sale-items`)
    })
    return {
      ok: true,
      message: 'Item creado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
