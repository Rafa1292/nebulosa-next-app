'use server'

import prisma from '@/lib/prisma'

interface PaginationOptions {
  page?: number
  take?: number
}

export const getPaginatedArticles = async ({ page = 1, take = 12 }: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    const articles = await prisma.article.findMany({
      take: take,
      skip: (page - 1) * take,
    })

    const totalArticles = await prisma.article.count({})

    return {
      ok: true,
      currentPage: page,
      totalPages: Math.ceil(totalArticles / take),
      articles: articles ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los articulos',
    }
  }
}
