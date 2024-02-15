import React from 'react'
import { redirect } from 'next/navigation'
import { Title } from '@/components'
import { getRecipeById } from '@/actions'
import { RecipeForm } from './ui/RecipeForm'

interface Props {
  params: {
    recipeId: string
    id: string
  }
}

export default async function ProviderPage({ params }: Props) {
  const { recipeId } = params
  const { recipe } = await getRecipeById(recipeId)
  const title = recipeId === 'add' ? 'Agregar receta' : 'Editar receta'

  if (!recipe && recipeId !== 'add') {
    redirect(`admin/articles/${params.id}/recipes`)
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <RecipeForm articleId={params.id} recipe={recipe ?? {}} />
    </div>
  )
}
