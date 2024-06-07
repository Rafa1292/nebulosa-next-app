'use server'

import { auth } from '@/auth.config'
import { Entry } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getWorkDayByEmail } from '../work-day/get-work-day-by-email'
import { revalidatePath } from 'next/cache'

const accountHistorySchema = z.object({
  amount: z.number(),
  previousBalance: z.number(),
  currentBalance: z.number(),
  pay: z.boolean(),
  payMethodId: z.string(),
})

const entrySchema = z.object({
  description: z.string(),
  accountHistory: accountHistorySchema,
})

export const createEntry = async (entry: Partial<Entry>) => {
  try {
    const session = await auth()
    if (!session) {
      return {
        ok: false,
        message: 'No se pudo obtener la sesión',
      }
    }
    const { workDay } = await getWorkDayByEmail(session.user.email)
    if (!workDay) {
      return {
        ok: false,
        message: 'No se encontró la jornada laboral',
      }
    }

    const {accountHistory: tmpAccountHistory, ...validEntry} = entrySchema.parse(entry)

    await prisma.$transaction(async (tx) => {
      const accountHistory = await tx.accountHistory.create({
        data: {
          ...tmpAccountHistory,
        },
      })

      await tx.entry.create({
        data: {
          accountHistoryId: accountHistory.id,
          workDayId: workDay.id,
          ...validEntry,
        },
      })
    })

    revalidatePath(`/billing/entries/${workDay.id}`)

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
