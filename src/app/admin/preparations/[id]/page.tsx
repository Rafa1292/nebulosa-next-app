import React from 'react'
import { redirect } from 'next/navigation'
import { PreparationForm } from './ui/PreparationForm'
import { getInputs, getPreparationById } from '@/actions'

interface Props {
  params: {
    id: string
  }
}

export default async function PreparationPage({ params }: Props) {
  const { id } = params
  const { preparation } = await getPreparationById(id)
  const { inputs } = await getInputs()

  if (!preparation && id !== 'add') {
    redirect('/admin/preparations')
  }

  return (
    <div className='w-full justify-center flex-wrap flex'>
      <PreparationForm title={'Preparacion'} id={id} inputs={inputs ?? []}  />
    </div>
  )
}
