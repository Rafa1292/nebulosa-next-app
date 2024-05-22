'use server'

import prisma from '@/lib/prisma'

export const getTables = async () => {
  try {
    const tables = await prisma.roomTable.findMany()
    if (!tables) {
      return {
        ok: false,
        message: 'No se encontraron mesas',
      }
    }
    return {
      ok: true,
      tables,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener las mesas',
    }
  }
}
