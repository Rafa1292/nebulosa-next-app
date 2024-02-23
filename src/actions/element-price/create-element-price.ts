'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const elementPriceSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  menuId: z.string().uuid(),
  modifierElementId: z.string().uuid(),
  price: z.number().int().positive(),
})

export const createUpdateElementPrice = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = elementPriceSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...elementPrice } = parse.data

    if (id) {
      // update
      await prisma.elementPrice.update({
        where: {
          id,
        },
        data: elementPrice,
      })
    } else {
      // create
      await prisma.elementPrice.create({
        data: elementPrice,
      })
    }
    revalidatePath(`/admin/modifier-elements/${elementPrice.modifierElementId}`)

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
