import React from 'react'
import { redirect } from 'next/navigation'
import { BudgetForm } from './ui/BudgetForm'
import { Title } from '@/components'
import { getBudgetById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function InputPage({ params }: Props) {
  const { id } = params
  const {budget} = await getBudgetById(id)

  if (!budget && id !== 'add') {
    redirect('/admin/budgets')
  }
  const title = id === 'add' ? 'Agregar presupuesto' : 'Editar presupuesto' 


  return (
    <div className='w-100 justify-center flex-wrap flex'>
      <Title title={title} />
      <BudgetForm  budget={budget ?? {}} />
    </div>
  )
}
