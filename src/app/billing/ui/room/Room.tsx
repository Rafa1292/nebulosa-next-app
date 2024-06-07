'use client'

import React, { useEffect } from 'react'
import { Table } from '../../edit-room/ui/Table'
import { useRoomTableStore } from '@/store'
import { Bill } from '../bill/Bill'
import { Menu, SaleItemCategory } from '@/interfaces'
import { useWorkDayStore } from '@/store'
import Link from 'next/link'

interface Props {
  saleItemCategories: SaleItemCategory[]
  menus: Menu[]
  email: string
}

export const Room = ({ menus, saleItemCategories, email }: Props) => {
  const { tables } = useRoomTableStore()
  const [show, setShow] = React.useState(false)
  const [tableNumber, setTableNumber] = React.useState<number | null>(null)

  const handleTableClick = (tableNumber: number) => {
    setTableNumber(tableNumber)
    setShow(true)
  }

  useEffect(() => {
    const workDayId = useWorkDayStore.getState().workDayId
    if (!workDayId) {
      useWorkDayStore.getState().getWorkDayByEmail(email)
    }
  }, [])

  return (
    <>
      <div className='w-[85%] relative h-full'>
        {tables.map((table, index) => (
          <div
            key={index}
            className='rounded-full bg-black w-[100px] h-[100px] cursor-pointer flex-wrap flex justify-center items-center absolute'
            style={{ top: `calc(${table.posY}% - 56px)`, left: `calc(${table.posX}% - 15%)` }}
          >
            <Table onClickEvent={() => handleTableClick(table.number)} tableNumber={table.number} />
          </div>
        ))}

      </div>
      <div 
      className='absolute border-2 bg-gray-200 p-6 border-gray-600 shadow-lg right-2 top-[35vh] rounded-bl-2xl rounded-tr-2xl'>
        <Link href={`/billing/entries/${useWorkDayStore.getState().workDayId}`}>
          <div className='py-2 font-bold cursor-pointer hover:text-gray-500'>Entradas</div>
        </Link>
          <div className='py-2 font-bold cursor-pointer hover:text-gray-500'>Gastos</div>

        </div>
      <Bill tableNumber={tableNumber} menus={menus} saleItemCategories={saleItemCategories} show={show} setShow={setShow} />
    </>
  )
}
