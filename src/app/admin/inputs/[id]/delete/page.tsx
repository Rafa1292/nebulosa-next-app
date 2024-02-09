'use client'
import { deleteInput, getInputById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeleteInputPage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [inputName, setInputName] = useState('')

  useEffect(() => {
    getInputById(id).then((res) => {
        if (res.input) {
            setInputName(res.input.name)
        }
        })
    }, [id])


  const onDelete = () => {
    setDeleting(true)
    deleteInput(id).then((res) => {
      if (res.ok) {
        router.push('/admin/inputs')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar insumo' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar el insumo {inputName}?</span>
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
