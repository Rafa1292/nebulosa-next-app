'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const saleItemCategorySchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string()
})

export const createUpdateSaleItemCategory = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = saleItemCategorySchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...saleItemCategory } = parse.data

    if (id) {
      // update
      await prisma.saleItemCategory.update({
        where: {
          id,
        },
        data: saleItemCategory,
      })
    } else {
      // create
      await prisma.saleItemCategory.create({
        data: saleItemCategory,
      })
    }
    revalidatePath(`/admin/sale-item-categories`)

    return {
      ok: true,
      message: 'Categoria creada',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
