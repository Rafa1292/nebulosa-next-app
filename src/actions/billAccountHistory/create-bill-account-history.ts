import { BillAccountHistory } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const accountHistorySchema = z.object({
  amount: z.number(),
  previousBalance: z.number(),
  currentBalance: z.number(),
  pay: z.boolean(),
  payMethodId: z.string(),
})

const billAccountHistorySchema = z.object({
  billId: z.string(),
  accountHistoryId: z.string(),
  accountHistory: accountHistorySchema,
})

const billAccountHistoriesSchema = z.array(billAccountHistorySchema)

export const createBillAccountHistories = async (billAccountHistories: BillAccountHistory[], tx: any) => {
  try {
    const parse = billAccountHistoriesSchema.safeParse(billAccountHistories)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const data = parse.data
    for (const billAccountHistory of data) {
      const createdAccountHistory = await tx.accountHistory.create({
        data: {
          ...billAccountHistory.accountHistory,
        },
      })
      await tx.billAccountHistory.create({
        data: {
          ...billAccountHistory,
          accountHistoryId: createdAccountHistory.id,
        },
      })
    }

    return {
      ok: true,
      message: 'Historial creado',
    }
  } catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}
