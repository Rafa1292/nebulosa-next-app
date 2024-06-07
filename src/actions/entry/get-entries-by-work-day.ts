'use server'

import prisma from '@/lib/prisma'

export const getEntriesByWorkDay = async (workDayId: string) => {
  try {
    const entries = await prisma.entry.findMany({
      where: {
        workDayId,
      },
      include: {
        accountHistory: true,
      },
    })

    return {
      ok: true,
      entries,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener las  entradas del día de trabajo',
    }
  }
}
