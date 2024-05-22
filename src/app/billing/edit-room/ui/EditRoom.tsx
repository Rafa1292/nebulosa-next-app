'use client'

import React, { useEffect, useState } from 'react'
import { RoomTable } from '@/interfaces'
import { Table } from './Table'
import { useRoomTableStore } from '@/store'

const initTable: RoomTable = {
  id: '',
  inUse: false,
  number: 0,
  posX: 0,
  posY: 0,
  type: 'table',
}

export const EditRoom = () => {
  const [tables, setTables] = useState<RoomTable[]>([])
  const { createTables, getTables } = useRoomTableStore()
  //get screen width and height and calculate the percentage


  const getPositionValues = (x: number, y: number) => {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight
    const posX = (x * 100) / width
    const posY = (y * 100) / height
    //redondear 
    return { posX: Math.round(posX), posY: Math.round(posY) }
  }

  const handleDrop = (ev: any, tableNumber: number) => {
    ev.preventDefault()
    const { posX, posY } = getPositionValues(ev.clientX, ev.clientY)
    if (tableNumber === 0) {
      setTables([...tables, { ...initTable, posX, posY, number: tables.length + 1 }])
    } else {
      const newTables = tables.map((table) => {
        if (table.number === tableNumber) {
          return { ...table, posX, posY }
        }
        return table
      })
      setTables(newTables)
    }
  }

  useEffect(() => {
    getTables().then((tables) => {
      setTables(tables)
    })
  }, [])

  return (
    <>
      <div className='w-[15%] justify-center content-between flex py-10 flex-wrap h-[80vh] rounded-r-xl border-2 border-gray-900 border-l-0 overflow-hidden bg-white shadow-md'>
        <div draggable onDragEnd={(ev) => handleDrop(ev, 0)}>
          <Table />
        </div>
        <button onClick={()=> createTables(tables)} className='bg-green-700 w-[95%] h-[60px] text-white p-2 rounded-md mt-5'>Save</button>
      </div>
      <div className='w-[85%] relative'>
        {tables.map((table, index) => (
          <div
            onDragEnd={(ev) => handleDrop(ev, table.number)}
            key={index}
            className='rounded-full bg-black w-[100px] h-[100px] cursor-pointer flex-wrap flex justify-center items-center absolute'
            style={{ top: `calc(${table.posY}% - 56px)`, left: `calc(${table.posX}% - 15%)` }}
          >
            <Table />
          </div>
        ))}
      </div>
    </>
  )
}
