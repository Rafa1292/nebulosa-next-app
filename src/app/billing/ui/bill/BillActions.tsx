'use client'

import { ProgressBar } from '@/components'
import { useBillStore } from '@/store'
import { currencyFormat } from '@/utils'
import { useEffect, useState } from 'react'
import { FaCashRegister } from 'react-icons/fa6'
import { LuConciergeBell } from 'react-icons/lu'
import { MdOutlineRestaurantMenu } from 'react-icons/md'

interface Props {
  setShow: (show: boolean) => void
  showPayMethod: boolean
  setShowPayMethod: (show: boolean) => void
}

export const BillActions = ({ setShow, showPayMethod, setShowPayMethod }: Props) => {
  const { bill, saveBill, getTotalBill } = useBillStore()
  const [billSaved, setBillSaved] = useState(true)
  const [commandActionWait, setCommandActionWait] = useState(false)
  const [loaded, setLoaded] = useState(false)

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
  useEffect(() => {
    setLoaded(true)
  }, [bill])

  return (
    <>
      {bill.id === '' && !billSaved ? (
        <>
          {commandActionWait ? (
            <div className='w-full h-full content-start  flex-wrap flex justify-center'>
              <span className='text-xl w-full text-center py-4 text-red-800 '>¿Deseas salir?</span>
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
            <div
              onClick={() => commandBill()}
              className='w-full text-8xl hover:text-9xl  rounded-t-lg h-full items-center flex justify-center bg-green-800 text-white hover:bg-green-700 cursor-pointer'
            >
              <LuConciergeBell />
            </div>
          )}
        </>
      ) : (
        <div className='w-full h-full items-center flex justify-center'>
          <div className='w-2/5 flex items-center text-green-700 hover:text-white justify-center hover:bg-green-700 h-full'>
            <div
              onClick={() => setShowPayMethod(!showPayMethod)}
              className='p-5 cursor-pointer border-2  rounded-xl border-green-700 hover:border-white'
            >
              {!showPayMethod ? <FaCashRegister size={50} className='' /> : <MdOutlineRestaurantMenu size={50} />}
            </div>
          </div>
          <div className='w-3/5 font-bold select-none shadow-lg py-4 content-end h-full'>
            {loaded && (
              <>
                <div className='w-full flex-wrap flex'>
                  <div className='w-3/5 pr-4 text-right'>Subtotal:</div>
                  <div className='w-2/5 text-left'>¢24 000</div>
                </div>
                <div className='w-full flex-wrap flex'>
                  <div className='w-3/5 pr-4 text-right'>Impuesto:</div>
                  <div className='w-2/5 text-left'>¢0</div>
                </div>
                <div className='w-full flex-wrap flex'>
                  <div className='w-3/5 pr-4 text-right'>Descuento:</div>
                  <div className='w-2/5 text-left'>¢0</div>
                </div>
                <div className='w-full flex-wrap flex'>
                  <div className='w-3/5 pr-4 text-right'>Total:</div>
                  <div className='w-2/5 text-left'>{currencyFormat(getTotalBill())}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
