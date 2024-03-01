import React from 'react'
import { redirect } from 'next/navigation'
import { Title } from '@/components'
import { getModifierGroupById } from '@/actions'
import { ModifierGroupForm } from './ui/ModifierGroupForm'

interface Props {
  params: {
    id: string
  }
}

export default async function ModifierGroupPage({ params }: Props) {
  const { id } = params
  const {modifierGroup} = await getModifierGroupById(id)
  const title = id === 'add' ? 'Agregar grupo' : 'Actualizar grupo' 


  if (!modifierGroup && id !== 'add') {
    redirect('/admin/modifier-groups')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <ModifierGroupForm modifierGroup={modifierGroup ?? {}} />
    </div>
  )
}
