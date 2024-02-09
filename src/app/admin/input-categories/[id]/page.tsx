import React from 'react'
import { redirect } from 'next/navigation'
import { InputCategoryForm } from './ui/InputCategoryForm'
import { Title } from '@/components'
import { getInputCategoryById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function InputCategoryPage({ params }: Props) {
  const { id } = params
  const {inputCategory} = await getInputCategoryById(id)
  const title = id === 'add' ? 'Agregar categoria' : 'Editar categoria' 


  if (!inputCategory && id !== 'add') {
    redirect('/admin/input-categories')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <InputCategoryForm inputCategory={inputCategory ?? {}} />
    </div>
  )
}
