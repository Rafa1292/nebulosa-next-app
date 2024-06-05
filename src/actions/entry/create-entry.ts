'use server'

import { Entry } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'


const entrySchema = z.object({
  workDayId: z.string().uuid(),
  description: z.string(),
  accountHistoryId: z.string().uuid(),
})

export const createEntry = async (entry: Entry) => {
  try {
    const validEntry = entrySchema.parse(entry)
    await prisma.entry.create({
      data: {
        ...validEntry,
        },
    })
    
    return {
      ok: true,
      message: 'Entrada creada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
