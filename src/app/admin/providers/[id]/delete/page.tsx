'use client'
import { deleteProvider, getProviderById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeleteProviderPage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [providerName, setProviderName] = useState('')

  useEffect(() => {
    getProviderById(id).then((res) => {
        if (res.provider) {
            setProviderName(res.provider.name)
        }
        })
    }, [id])


  const onDelete = () => {
    setDeleting(true)
    deleteProvider(id).then((res) => {
      if (res.ok) {
        router.push('/admin/providers')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar proveedor' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar el proveedor {providerName}?</span>
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
