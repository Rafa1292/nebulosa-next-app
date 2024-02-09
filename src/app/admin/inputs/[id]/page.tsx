import React from 'react'
import { redirect } from 'next/navigation'
import { InputForm } from './ui/inputForm'
import { Title } from '@/components'
import { getProviderById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function InputPage({ params }: Props) {
  const { id } = params
  const {inputCategory: provider} = await getProviderById(id)
  const title = id === 'add' ? 'Agregar insumo' : 'Editar insumo' 


  if (!provider && id !== 'add') {
    redirect('/admin/inputs')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <InputForm input={provider ?? {}} />
    </div>
  )
}
