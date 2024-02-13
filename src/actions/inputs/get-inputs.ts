'use server'

import prisma from '@/lib/prisma'



export const getInputs = async ( ) => {
  try {
    const inputs = await prisma.input.findMany({ })


    return {
      ok: true,
      inputs: inputs ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los insumos',
    }
  }
}
