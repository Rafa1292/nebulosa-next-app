'use server'

import prisma from '@/lib/prisma'

export const getArticles = async () => {
  try {

    const articles = await prisma.article.findMany({})

    return {
      ok: true,
      articles: articles ?? [],
    }
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo obtener los articulos',
    }
  }
}
