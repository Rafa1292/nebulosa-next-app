'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const providerInputSchema = z.object({
  id: z.string().uuid().optional().nullable(),
    providerId: z.string().uuid(),
    inputId: z.string().uuid(),
    lowerPrice: z.number(),
    upperPrice: z.number(),
    currentPrice: z.number(),
    lastPrice: z.number(),
    expectedPrice: z.number(),
    presentation: z.number(),
    measureSlug: z.string(),
})

export const createUpdateProviderInput = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = providerInputSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...providerInput } = parse.data

    if (id) {
      // update
      await prisma.providerInput.update({
        where: {
          id,
        },
        data: providerInput,
      })
    } else {
      // create
      await prisma.providerInput.create({
        data: providerInput,
      })
    }
    revalidatePath(`/admin/providers/${providerInput.providerId}`)

    return {
      ok: true,
      message: 'Insumo asociado',
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
