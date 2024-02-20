'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const saleItemSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  saleItemCategoryId: z.string().uuid(),
  price: z.coerce.number().positive(),
})

export const createUpdateSaleItem = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = saleItemSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...saleItem } = parse.data

    if (id) {
      // update
      await prisma.saleItem.update({
        where: {
          id,
        },
        data: saleItem,
      })
    } else {
      // create
      await prisma.saleItem.create({
        data: saleItem,
      })
    }
    revalidatePath(`/admin/sale-items`)

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
