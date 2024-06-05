'use server'

import prisma from '@/lib/prisma'



export const nullBill = async (billId: string) => {
try {
    await prisma.bill.update({
        where: {
            id: billId
        },
        data: {
            isNull: true
        }
    })


    return {
        ok: true,
        message: 'Factura anulada correctamente',
    }
} catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}
