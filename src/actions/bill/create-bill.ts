'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'

const billSchema = z.object({
  closed: z.string().transform((val) => (val === 'true' ? true : false)),
  tableNumber: z.number(),
  deliveryMethod: z.enum(['Mesa', 'Domicilio', 'Recoger']),
  clientId: z.string().uuid(),
  addressId: z.string().uuid(),
  openWorkDayId: z.string().uuid(),
  closeWorkDayId: z.string().uuid(),
  commandTime: z.date(),
  isNull: z.boolean(),
  menuId: z.string().uuid(),
  isServed: z.boolean(),
  isCredit: z.boolean(),
  //pend items: BillItem[];
})

export const createBill = async (formData: FormData) => {
  try {
    const data = Object.fromEntries(formData)
    const parse = billSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const bill  = parse.data
    await prisma.bill.create({
      data: bill,
    })

    return {
      ok: true,
      message: 'Factura creada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}
