'use server'

import { ModifierElement } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const modifierElementSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  defaultRecipeId: z.string().optional(),
  combinable: z.boolean(),
  combinableModifierGroupId: z.string().optional(),
  modifierGroupId: z.string().uuid(),
})

export const createUpdateModifierElement = async (modifierElementData: ModifierElement) => {
  try {
    console.log('modifierElementData', modifierElementData)
    const parse = modifierElementSchema.safeParse(modifierElementData)
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
        data: {
          ...modifierElement,
          defaultRecipeId: modifierElement.defaultRecipeId || '',
          combinableModifierGroupId: modifierElement.combinableModifierGroupId || '',
        },
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
