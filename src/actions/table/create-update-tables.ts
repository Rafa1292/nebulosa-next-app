'use server'

import { RoomTable } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const roomTableSchema = z.object({
  posX: z.number().int().default(0),
  posY: z.number().int().default(0),
  number: z.number().int().default(0),
  type: z.string().optional().default(''),
  inUse: z.boolean().optional(),
})

export const createUpdateTables = async (tables: RoomTable[]) => {
  try {
    const tablesData = tables.map((table) => roomTableSchema.parse(table))
    //transaction
    await prisma.$transaction(async (tx) => {
    await tx.roomTable.deleteMany()
    await tx.roomTable.createMany({
      data: tablesData,
    })
  })

    revalidatePath(`/billing`)

    return {
      ok: true,
      message: 'Mesas creadas',
    }
  } catch (error: any) {
    console.log(error)
    return {
      ok: false,
      message: error.message,
    }
  }
}
