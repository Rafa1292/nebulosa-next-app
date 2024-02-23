import React from 'react'
import { redirect } from 'next/navigation'
import { MenuForm } from './ui/MenuForm'
import { Title } from '@/components'
import { getMenuById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function MenuPage({ params }: Props) {
  const { id } = params
  const {menu} = await getMenuById(id)
  const title = id === 'add' ? 'Agregar menu' : 'Editar menu' 


  if (!menu && id !== 'add') {
    redirect('/admin/menus')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <MenuForm menu={menu ?? {}} />
    </div>
  )
}
