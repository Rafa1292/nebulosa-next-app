'use server'

import prisma from '@/lib/prisma'

export const getSaleItemCategoriesWithRelations = async () => {
  try {
    const saleItemCategories = await prisma.saleItemCategory.findMany({
      include: {
        saleItems: {
          include: {
            prices: true,
            saleItemArticles: {
              include: {
                article: {
                  include: {
                    articleModifiers: {
                      include: {
                        prices: true,
                        modifierGroup: {
                          include: {
                            elements: {
                              include: {
                                prices: true,
                              },
                            },
                          },
                        },
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

    return {
      ok: true,
      saleItemCategories: saleItemCategories ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener las categorias',
    }
  }
}
