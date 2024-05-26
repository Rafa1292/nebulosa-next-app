import prisma from "@/lib/prisma"

export const getBillsByWorkDayId = async (id: string) => {
    try {
        const bills = await prisma.bill.findMany({
            where: {
            openWorkDayId: id
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