import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"
import { getWorkDayByEmail } from "../work-day/get-work-day-by-email"

export const getBillsByWorkDayId = async () => {
    try {
        const session = await auth()
        if (!session) {
          return {
            ok: false,
            message: 'No se pudo obtener la sesión',
          }
        }
        const {workDay} = await getWorkDayByEmail(session.user.email)
        if (!workDay) {
            return {
            ok: false,
            message: 'No se encontró la jornada laboral',
            }
        }
        const bills = await prisma.bill.findMany({
            where: {
            openWorkDayId: workDay.id,
            },
            include: {
            items: {
                include: {
                itemArticles: {
                    include: {
                    linkedArticles: {
                        include: {
                        modifiers: {
                            include: {
                            elements: true,
                            },
                        },
                        },
                    },
                    },
                },
                },
            },
            },
        })
        console.log(bills)
    
        if (!bills) {
            return {
            ok: false,
            message: 'No se encontró las facturas',
            }
        }
    
        return {
            ok: true,
            bills
        }
    } catch (error) {
      return {
        ok: false,
        message: 'No se pudo obtener las facturas',
      }
    }
  }