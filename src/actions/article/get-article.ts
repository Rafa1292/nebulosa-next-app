'use server'

import prisma from '@/lib/prisma'

export const getArticleById = async (id: string) => {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        articleModifiers: true,
      },
    })
    return {
      ok: true,
      article,
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo obtener el articulo',
    }
  }
}
