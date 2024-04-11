import React from 'react'
import { redirect } from 'next/navigation'
import { Title } from '@/components'
import { getAccounts, getBrandById, getPayMethodById } from '@/actions'
import { PayMethodForm } from './ui/PayMethodForm'

interface Props {
  params: {
    id: string
  }
}

export default async function BrandPage({ params }: Props) {
  const { id } = params
  const {payMethod} = await getPayMethodById(id)
  const {accounts} = await getAccounts()

  const title = id === 'add' ? 'Agregar metodo de pago' : 'Editar metodo de pago' 


  if (!payMethod && id !== 'add') {
    redirect('/admin/pay-methods')
  }

  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <PayMethodForm payMethod={payMethod ?? {}} accounts={accounts ?? []}/>
    </div>
  )
}
