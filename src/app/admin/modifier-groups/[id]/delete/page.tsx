'use client'
import { deleteModifierGroup, getModifierGroupById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeleteModifierGroupPage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [groupName, setGroupName] = useState('')

  useEffect(() => {
    getModifierGroupById(id).then((res) => {
      if (res.modifierGroup) {
        setGroupName(res.modifierGroup.name)
      }
    })
  }, [id])

  const onDelete = () => {
    setDeleting(true)
    deleteModifierGroup(id).then((res) => {
      if (res.ok) {
        router.push('/admin/modifier-groups')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar grupo' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar el grupo {groupName}?</span>
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
