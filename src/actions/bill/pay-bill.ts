'use server'

import { BillAccountHistory } from '@/interfaces'
import { getBillById } from './get-bill'
import { getTotalBill } from '@/utils'
import { createBillAccountHistories } from '..'
import prisma from '@/lib/prisma'

const validateAccountHistories = (billHistories: BillAccountHistory[], totalBill: number) => {
  let total = 0
  billHistories.forEach((billHistory) => {
    total += billHistory.accountHistory?.amount ?? 0
  })
  return total === totalBill
}

export const payBill = async (billId: string, tmpBillAccountHistories: BillAccountHistory[]) => {
try {
    const { bill } = await getBillById(billId)
    if (!bill) {
      return { ok: false, message: 'Factura no encontrada' }
    }
    const total = getTotalBill(bill)
    console.log(total)
    if (!validateAccountHistories(tmpBillAccountHistories, total)) {
      return { ok: false, message: 'El monto de los pagos no coincide con el total de la factura' }
    }
    const billAccountHistories = tmpBillAccountHistories.map((billAccountHistory) => {
      return {
        ...billAccountHistory,
        billId,
      }
    })
    await prisma.$transaction(async (tx) => {
      await createBillAccountHistories(billAccountHistories, tx)
      const x = await tx.bill.update({
        where: { id: billId },
        data: {
          closed: true,
        },
      })
    })

    return {
        ok: true,
        message: 'Factura pagada',
    }
} catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}
