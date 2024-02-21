'use client'
import { deleteBudget, deleteInput, getBudgetById, getInputById } from '@/actions'
import { Title } from '@/components'
import { getMonthName } from '@/utils'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeleteBudgetPage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [budgetName, setbudgetName] = useState('')

  useEffect(() => {
    getBudgetById(id).then((res) => {
        if (res.budget) {
            setbudgetName(`${getMonthName(res.budget.month)} ${res.budget.year}`)
        }
        })
    }, [id])


  const onDelete = () => {
    setDeleting(true)
    deleteBudget(id).then((res) => {
      if (res.ok) {
        router.push('/admin/budgets')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar presupuesto' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar el presupuesto de {budgetName}?</span>
      <button
        disabled={deleting}
        onClick={() => onDelete()}
        className={clsx('text-white font-bold py-2 px-4  rounded', {
          'bg-red-800 hover:bg-red-700 cursor-pointer': !deleting,
          'btn-secondary cursor-not-allowed': deleting,
        })}
      >
        Eliminar
      </button>
    </div>
  )
}
