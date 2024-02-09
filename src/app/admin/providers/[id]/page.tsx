import React from 'react'
import { redirect } from 'next/navigation'
import { ProviderForm } from './ui/ProviderForm'
import { Title } from '@/components'
import { getProviderById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function ProviderPage({ params }: Props) {
  const { id } = params
  const {provider} = await getProviderById(id)
  const title = id === 'add' ? 'Agregar proveedor' : 'Editar proveedor' 


  if (!provider && id !== 'add') {
    redirect('/admin/providers')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <ProviderForm provider={provider ?? {}} />
    </div>
  )
}
