import React from 'react'
import { redirect } from 'next/navigation'
import { SaleItemCategoryForm } from './ui/SaleItemCategoryForm'
import { Title } from '@/components'
import { getSaleItemCategoryById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function InputCategoryPage({ params }: Props) {
  const { id } = params
  const {saleItemCategory} = await getSaleItemCategoryById(id)
  const title = id === 'add' ? 'Agregar categoria' : 'Editar categoria' 


  if (!saleItemCategory && id !== 'add') {
    redirect('/admin/sale-item-categories')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <SaleItemCategoryForm saleItemCategory={saleItemCategory ?? {}} />
    </div>
  )
}
