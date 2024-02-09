import React from 'react'
import { redirect } from 'next/navigation'
import { InputForm } from './ui/InputForm'
import { Title } from '@/components'
import { getInputById, getInputCategories } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function InputPage({ params }: Props) {
  const { id } = params
  const {input} = await getInputById(id)
  const title = id === 'add' ? 'Agregar insumo' : 'Editar insumo' 
  const {inputCategories} = await getInputCategories()

  if (!input && id !== 'add') {
    redirect('/admin/inputs')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <InputForm inputCategories={inputCategories??[]} input={input ?? {}} />
    </div>
  )
}
