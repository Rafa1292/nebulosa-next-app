'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const brandSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string()
})

export const createUpdateBrand = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = brandSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...brand } = parse.data

    if (id) {
      // update
      await prisma.brand.update({
        where: {
          id,
        },
        data: brand,
      })
    } else {
      // create
      await prisma.brand.create({
        data: brand,
      })
    }
    revalidatePath(`/admin/brands`)

    return {
      ok: true,
      message: 'Marca creada',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
