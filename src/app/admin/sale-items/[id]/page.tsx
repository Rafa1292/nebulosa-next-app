import React from 'react'
import { redirect } from 'next/navigation'
import { SaleItemForm } from './ui/SaleItemForm'
import { Title } from '@/components'
import { getArticles, getMenus, getSaleItemById, getSaleItemCategories } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function InputPage({ params }: Props) {
  const { id } = params
  const {saleItem} = await getSaleItemById(id)
  const title = id === 'add' ? 'Agregar item' : 'Actualizar item' 
  const {saleItemCategories} = await getSaleItemCategories()
  const { articles= [] } = await getArticles()
  const { menus } = await getMenus()

  if (!saleItem && id !== 'add') {
    redirect('/admin/sale-items')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <SaleItemForm 
      menus={menus ?? []}
      saleItemCategories={saleItemCategories??[]} 
      saleItem={saleItem ?? {}}
      articles={articles ?? []}
      />
    </div>
  )
}
