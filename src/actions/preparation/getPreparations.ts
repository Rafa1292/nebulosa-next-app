'use server'

import prisma from '@/lib/prisma'

export const getPreparations = async () => {
  try {

    const preparations = await prisma.preparation.findMany({
      
    })

    return {
      ok: true,
      preparations: preparations ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las preparaciones',
    }
  }
}
