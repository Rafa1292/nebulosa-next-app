'use server'

import prisma from '@/lib/prisma'

export const getBillByTableNumber = async (tableNumber: number) => {
  try {
    const bill = await prisma.bill.findFirst({
      where: {
        tableNumber: tableNumber,
        closed: false,
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

    if (!bill) {
      return {
        ok: false,
        message: 'No se encontró la factura',
      }
    }

    return {
      ok: true,
      bill
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener la factura',
    }
  }
}

export const getBillById = async (id: string) => {
  try {
    const bill = await prisma.bill.findFirst({
      where: {
        id,
      },
      include: {
        customer: {
          include: {
            addresses: true,
          },
        },
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

    if (!bill) {
      return {
        ok: false,
        message: 'No se encontró la factura',
      }
    }


    return {
      ok: true,
      bill
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener la factura',
    }
  }
}
