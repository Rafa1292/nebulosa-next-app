'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const menuSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  commissionPercentage: z.number().int().min(0).max(100),
})

export const createUpdateMenu = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = menuSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...menu } = parse.data

    if (id) {
      // update
      await prisma.menu.update({
        where: {
          id,
        },
        data: menu,
      })
    } else {
      // create
      await prisma.menu.create({
        data: menu,
      })
    }
    revalidatePath(`/admin/menus`)

    return {
      ok: true,
      message: 'Menu creado',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
