import React from 'react'
import { redirect } from 'next/navigation'
import { PreparationForm } from './ui/PreparationForm'
import { Title } from '@/components'
import { getPreparationById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function PreparationPage({ params }: Props) {
  const { id } = params
  const {preparation} = await getPreparationById(id)
  const title = id === 'add' ? 'Agregar preparacion' : 'Editar preparacion' 


  if (!preparation && id !== 'add') {
    redirect('/admin/preparations')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <PreparationForm preparation={preparation ?? {}} />
    </div>
  )
}
