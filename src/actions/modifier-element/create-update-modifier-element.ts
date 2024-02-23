'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const modifierElementSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  defaultRecipeId: z.string().uuid(),
  combinable: z.string().transform((val) => (val === 'true' ? true : false)),
  combinableModifierGroupId: z.string().uuid(),
  modifierGroupId: z.string().uuid(),
})

export const createUpdateModifierElement = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = modifierElementSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...modifierElement } = parse.data

    if (id) {
      // update
      await prisma.modifierElement.update({
        where: {
          id,
        },
        data: modifierElement,
      })
    } else {
      // create
      await prisma.modifierElement.create({
        data: modifierElement,
      })
    }
    revalidatePath(`/admin/modifier-groups/${modifierElement.modifierGroupId}`)

    return {
      ok: true,
      message: 'Elemento creado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
