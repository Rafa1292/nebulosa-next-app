'use server'

import { Address } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addressSchema = z.object({
  id: z.string().optional().nullable(),
  description: z.string(),
  customerId: z.string().uuid(),
})

export const createUpdateAddress = async (data: Address) => {
  try {
    const parse = addressSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...address } = parse.data

    if (id) {
      // update
      await prisma.address.update({
        where: {
          id,
        },
        data: address,
      })
    } else {
      // create
      await prisma.address.create({
        data: address,
      })
    }
    // revalidatePath(`/admin/brands`)

    return {
      ok: true,
      message: 'Direccion creada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
