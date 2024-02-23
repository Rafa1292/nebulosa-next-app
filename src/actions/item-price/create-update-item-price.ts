'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const itemPriceSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  itemId: z.string().uuid(),
  menuId: z.string().uuid(),
  saleItemId: z.string().uuid(),
  price: z.number().int().positive(),
})

export const createUpdateItemPrice = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = itemPriceSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...itemPrice } = parse.data

    if (id) {
      // update
      await prisma.itemPrice.update({
        where: {
          id,
        },
        data: itemPrice,
      })
    } else {
      // create
      await prisma.itemPrice.create({
        data: itemPrice,
      })
    }
    revalidatePath(`/admin/sale-items/${itemPrice.saleItemId}`)

    return {
      ok: true,
      message: 'Precio creado',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
