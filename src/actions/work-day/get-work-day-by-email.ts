'use server'

import prisma from "@/lib/prisma"




export const getWorkDayByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      throw new Error('El usuario no existe')
    }

    const workDay = await prisma.workDay.findFirst({
      where: {
        userId: user.id,
        closed: false
      }
    })

    if (!workDay) {
      throw new Error('No se encontro el dia de trabajo')
    }
    return {
      ok: true,
      workDay
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message
    }
  }
}