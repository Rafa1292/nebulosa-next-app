'use client'

import { nullBill } from '@/actions/bill/null-bill'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { FaEye } from 'react-icons/fa6'
import { IoMdPrint } from 'react-icons/io'

interface Props {
  billId: string
}

export const BillActions = ({ billId }: Props) => {
  const { refresh } = useRouter()
  const handleNullBill = async () => {
    const { message } = await nullBill(billId)
    alert(message)
    refresh()
  }
  return (
    <td className='px-6 py-4 flex-wrap flex items-center justify-between'>
      <Link href={`/billing/bills/${billId}`} className='font-bold text-2xl cursor-pointer'>
        <FaEye className='text-white cursor-pointer text-xl hover:text-black' />
      </Link>
      <FaTrashAlt onClick={() => handleNullBill()} className='text-white cursor-pointer text-xl hover:text-red-800' />
      <IoMdPrint className='text-white cursor-pointer text-xl hover:text-blue-800' />
    </td>
  )
}
