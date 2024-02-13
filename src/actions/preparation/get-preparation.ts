'use server'

import prisma from '@/lib/prisma'

export const getPreparationById = async (id: string) => {
  try {
    const preparation = await prisma.preparation.findUnique({
      where: {
        id,
      },
      include: {
        PreparationInputs: {
          include: {
            input: true,
          },
        },
      },
    })

    if (!preparation) {
      return {
        ok: false,
        message: 'No se pudo obtener la preparacion',
      }
    }

    return {
      ok: true,
      preparation,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la preparacion',
    }
  }
}
