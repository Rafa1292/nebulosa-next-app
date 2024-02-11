import React from 'react'
import { redirect } from 'next/navigation'
import { BrandForm } from './ui/BrandForm'
import { Title } from '@/components'
import { getBrandById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function BrandPage({ params }: Props) {
  const { id } = params
  const {brand} = await getBrandById(id)
  const title = id === 'add' ? 'Agregar marca' : 'Editar marca' 


  if (!brand && id !== 'add') {
    redirect('/admin/brands')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <BrandForm brand={brand ?? {}} />
    </div>
  )
}
