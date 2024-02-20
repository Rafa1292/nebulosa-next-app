'use client'
import { deleteInput, deleteSaleItem, getInputById, getSaleItemById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeleteSaleItemPage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [saleItemName, setSaleItemName] = useState('')

  useEffect(() => {
    getSaleItemById(id).then((res) => {
        if (res.saleItem) {
            setSaleItemName(res.saleItem.name)
        }
        })
    }, [id])


  const onDelete = () => {
    setDeleting(true)
    deleteSaleItem(id).then((res) => {
      if (res.ok) {
        router.push('/admin/sale-items')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar item' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar el item {saleItemName}?</span>
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
