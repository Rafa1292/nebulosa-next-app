import React from 'react'
import { redirect } from 'next/navigation'
import { ArticleForm } from './ui/ArticleForm'
import { Title } from '@/components'
import { getArticleById, getMenus, getModifierGroups } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = params
  const {article} = await getArticleById(id)
  const { menus } = await getMenus()
  const { modifierGroups } = await getModifierGroups()
  const title = id === 'add' ? 'Agregar articulo' : 'Editar articulo' 


  if (!article && id !== 'add') {
    redirect('/admin/articles')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <ArticleForm menus={menus ?? []} article={article ?? {}} modifierGroups={modifierGroups ?? []}/>
    </div>
  )
}
