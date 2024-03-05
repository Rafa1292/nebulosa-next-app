'use server'

import prisma from '@/lib/prisma'

export const getModifierGroupById = async (id: string) => {
  try {
    const modifierGroup = await prisma.modifierGroup.findUnique({
      where: {
        id,
      },
      include: {
        elements: {
          include: {
            prices: true,
          },
        }
      },
    })
    console.log(modifierGroup)
    return {
      ok: true,
      modifierGroup,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el grupo',
    }
  }
}
