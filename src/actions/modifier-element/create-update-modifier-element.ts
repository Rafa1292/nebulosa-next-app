'use server'

import { ElementPrice, ModifierElement } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createUpdateElementPrice } from '..'

const elementPriceSchema = z.object({
  id: z.string().optional(),
  menuId: z.string().uuid(),
  modifierElementId: z.string().uuid().nullable().optional(),
  price: z.number().int().positive(),
})

const modifierElementSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string(),
  defaultRecipeId: z.string().optional(),
  combinable: z.boolean(),
  combinableModifierGroupId: z.string().optional(),
  modifierGroupId: z.string().uuid(),
  prices: z.array(elementPriceSchema).optional(),
})

export const createUpdateModifierElement = async (modifierElementData: ModifierElement) => {
  try {
    const parse = await modifierElementSchema.safeParseAsync(modifierElementData)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { prices, id, ...modifierElement } = parse.data

    await prisma.$transaction(async (tx) => {
    if (id) {
      // update
      await prisma.modifierElement.update({
        where: {
          id,
        },
        data: modifierElement,
      })
      //update-create-prices
      if (prices) {
        for (const price of prices) {
          const elementPriceId = price.id === '' ? undefined : price.id
          const { ok, message } = await createUpdateElementPrice({ ...price, id: elementPriceId, modifierElementId: id }, tx)
          if (!ok) {
            throw new Error(message)
          }
        }
      }
    } else {
      // create
      const {id: newId} = await prisma.modifierElement.create({
        data: {
          ...modifierElement,
          defaultRecipeId: modifierElement.defaultRecipeId || '',
          combinableModifierGroupId: modifierElement.combinableModifierGroupId || '',
        },
      })

      if (prices) {
        for (const price of prices) {
          const { ok, message } = await createUpdateElementPrice({ ...price, id: undefined, modifierElementId: newId },tx)
          if (!ok) {
            throw new Error(message)
          }
        }
      }
    }
  })
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
