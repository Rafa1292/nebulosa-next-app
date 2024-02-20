import prisma from "@/lib/prisma"




export const getWorkDayByUserId = async () => {
  try {
    const today = new Date()
    const workDay = await prisma.workDay.findFirst({
      where: {
        AND: [
          {
            date: {
              gte: today
            }
          },
          {
            closed: false
          }
        ]
      }
    })
    return {
      ok: true,
      data: workDay
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message
    }
  }
}