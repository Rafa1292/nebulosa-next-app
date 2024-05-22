'use client'

import React from 'react'
import { Table } from '../../edit-room/ui/Table'
import { useRoomTableStore } from '@/store'
import { Bill } from '../bill/Bill'
import { Menu, SaleItemCategory } from '@/interfaces'

interface Props {
  saleItemCategories: SaleItemCategory[]
  menus: Menu[]
}

export const Room = ({ menus, saleItemCategories }: Props) => {
  const { tables } = useRoomTableStore()
  const [show, setShow] = React.useState(false)
  const [tableNumber, setTableNumber] = React.useState<number | null>(null)

  const handleTableClick = (tableNumber: number) => {
    setTableNumber(tableNumber)
    setShow(true)
  }

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
      <Bill tableNumber={tableNumber} menus={menus} saleItemCategories={saleItemCategories} show={show} setShow={setShow} />
    </>
  )
}
