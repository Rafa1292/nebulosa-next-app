'use client'
import { deleteAccount, getAccountById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeleteAccountPage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    getAccountById(id).then((res) => {
      if (res.account) {
        setAccountName(res.account.name)
      }
    })
  }, [id])

  const onDelete = () => {
    setDeleting(true)
    deleteAccount(id).then((res) => {
      if (res.ok) {
        router.push('/admin/accounts')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar cuenta' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar la cuenta {accountName}?</span>
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
