'use client'
import { deletePayMethod, getPayMethodById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeletePayMethodPage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [payMethodName, setPayMethodName] = useState('')

  useEffect(() => {
    getPayMethodById(id).then((res) => {
      if (res.payMethod) {
        setPayMethodName(res.payMethod.name)
      }
    })
  }, [id])

  const onDelete = () => {
    setDeleting(true)
    deletePayMethod(id).then((res) => {
      if (res.ok) {
        router.push('/admin/pay-methods')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar metodo de pago' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar el metodo de pago {payMethodName}?</span>
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
