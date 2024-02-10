'use client'

import { getInputById } from '@/actions'
import { Input } from '@/interfaces'
import { currencyFormat } from '@/utils'
import { useEffect, useState } from 'react'
import { measures } from '@/interfaces'
import Link from 'next/link'
import { CiEdit } from 'react-icons/ci'
import { FaTrashCan } from 'react-icons/fa6'

interface Props {
  params: {
    id: string
  }
}

export default function InputViewPage({ params }: Props) {
  const { id } = params
  const [input, setInput] = useState<Input | null>(null)

  useEffect(() => {
    getInputById(id).then((res) => {
      if (res.input) {
        setInput(res.input)
      }
    })
  }, [id])

  if (input === null) {
    return <div>cargando...</div>
  }

  return (
    <div className='w-full mt-10 flex-wrap justify-center flex'>
      <h1 className='w-full text-center text-2xl font-bold mb-2'>Detalle del insumo</h1>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Insumo:</span>
        <span className='font-bold w-3/6 pl-2'>{input.name}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Precio mas bajo</span>
        <span className='font-bold w-3/6 pl-2'>{currencyFormat(input.lowerPrice)}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Precio mas alto:</span>
        <span className='font-bold w-3/6 pl-2'>{currencyFormat(input.upperPrice)}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Último precio:</span>
        <span className='font-bold w-3/6 pl-2'>{currencyFormat(input.lastPrice)}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Precio esperado:</span>
        <span className='font-bold w-3/6 pl-2'>{currencyFormat(input.expectedPrice)}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Precio actual:</span>
        <span className='font-bold w-3/6 pl-2'>{currencyFormat(input.currentPrice)}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Stock:</span>
        <span className='font-bold w-3/6 pl-2'>{input.stock}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Stock sugerido:</span>
        <span className='font-bold w-3/6 pl-2'>{input.suggestedStock}</span>
      </div>
      <div className='w-2/3 justify-center flex hover:bg-gray-200 rounded-lg py-0 hover:py-2 transition-all cursor-pointer '>
        <span className='w-3/6 text-right pr-2'>Presentación:</span>
        <span className='font-bold w-3/6 pl-2'>{input.presentation}</span>
      </div>
      <div className='w-full gap-4 flex flex-wrap justify-center mt-10'>
        <Link href={`/admin/inputs/${input.id}`} className='font-bold text-2xl cursor-pointer'>
          <CiEdit className='font-bold text-3xl cursor-pointer hover:text-gray-500' />
        </Link>
        <Link href={`/admin/inputs/${input.id}/delete`} className='font-bold text-2xl cursor-pointer'>
          <FaTrashCan className='font-bold text-2xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all' />
        </Link>
      </div>
    </div>
  )
}
