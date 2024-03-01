'use server'

import prisma from '@/lib/prisma'


export const getModifierGroups = async () => {
  try {
    const modifierGroups = await prisma.modifierGroup.findMany()

    return {
      ok: true,
      modifierGroups: modifierGroups ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los grupos',
    }
  }
}
