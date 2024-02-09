'use server'

import prisma from '@/lib/prisma'

export const getInputCategoryById = async (id: string) => {
  try {
    const inputCategory = await prisma.inputCategory.findUnique({
      where: {
        id,
      },
    })
    return {
      ok: true,
      inputCategory: inputCategory,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener la categoria',
    }
  }
}
