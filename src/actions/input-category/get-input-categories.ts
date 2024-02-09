'use server'

import prisma from '@/lib/prisma'

export const getInputCategories = async () => {
  try {
    const inputCategories = await prisma.inputCategory.findMany({
    })

    const totalInputCategories = await prisma.inputCategory.count({})

    return {
      ok: true,
      inputCategories: inputCategories ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las categorias',
    }
  }
}
