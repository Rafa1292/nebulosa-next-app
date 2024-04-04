'use client'

import { ProgressBar } from '@/components'
import { useBillStore } from '@/store'
import { useState } from 'react'
import { LuConciergeBell } from 'react-icons/lu'

interface Props {
  setShow: (show: boolean) => void
}

export const BillActions = ({ setShow }: Props) => {
  const { bill, saveBill } = useBillStore()
  const [billSaved, setBillSaved] = useState(false)
  const [commandActionWait, setCommandActionWait] = useState(false)

  const commandBill = () => {
    const state = saveBill()
    if (state) {
      setCommandActionWait(true)
    }
  }

  const stayBill = () => {
    setCommandActionWait(false)
    setBillSaved(true)
  }

  const closeBill = () => {
    setShow(false)
    setCommandActionWait(false)
    setBillSaved(true)

  }

  return (
    <>
      {bill.id === '' && !billSaved ? (
        <>
          {commandActionWait ? (
            <div className='w-full h-full content-start  flex-wrap flex justify-center'>
              <span className='text-xl w-full text-center py-4 text-red-800 '>Saliendo</span>
              <button
                onClick={() => stayBill()}
                className='w-1/3 mx-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg p-4'
              >
                Continuar
              </button>
              <button
                onClick={() => closeBill()}
                className='w-1/3 mx-2 bg-red-800 text-white hover:bg-red-700 rounded-lg p-2'
              >
                Salir
              </button>
            </div>
          ) : (
            <div className='w-full text-8xl hover:text-9xl  rounded-t-lg h-full items-center flex justify-center bg-green-800 text-white hover:bg-green-700 cursor-pointer'>
              <LuConciergeBell onClick={() => commandBill()} />
            </div>
          )}
        </>
      ) : (
        <div className='w-full h-full items-center flex justify-center'>facturar</div>
      )}
    </>
  )
}
