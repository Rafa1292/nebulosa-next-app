import React from 'react'
import { redirect } from 'next/navigation'
import { Title } from '@/components'
import { getAccountById } from '@/actions'
import { AccountForm } from './ui/AccountForm'

interface Props {
  params: {
    id: string
  }
}

export default async function AccountPage({ params }: Props) {
  const { id } = params
  const {account} = await getAccountById(id)
  const title = id === 'add' ? 'Agregar cuenta' : 'Editar cuenta' 


  if (!account && id !== 'add') {
    redirect('/admin/accounts')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <AccountForm account={{...account, description: account?.description ?? ''} ?? {}} />
    </div>
  )
}
