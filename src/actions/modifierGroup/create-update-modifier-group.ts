'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const modifierGroupSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  showLabel: z.string().transform((val) => (val === 'true' ? true : false))
})

export const createUpdateModifierGroup = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = modifierGroupSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...modifierGroup } = parse.data

    if (id) {
      // update
      await prisma.modifierGroup.update({
        where: {
          id,
        },
        data: modifierGroup,
      })
    } else {
      // create
      await prisma.modifierGroup.create({
        data: modifierGroup,
      })
    }
    revalidatePath(`/admin/modifier-groups`)

    return {
      ok: true,
      message: 'Grupo creado',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
