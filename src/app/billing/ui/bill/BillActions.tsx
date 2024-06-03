'use client'

import { ProgressBar } from '@/components'
import { useBillStore, useWorkDayStore } from '@/store'
import { currencyFormat } from '@/utils'
import { useEffect, useState } from 'react'
import { FaCashRegister } from 'react-icons/fa6'
import { HiMiniReceiptPercent } from 'react-icons/hi2'
import { LuConciergeBell } from 'react-icons/lu'
import { MdOutlineRestaurantMenu } from 'react-icons/md'

interface Props {
  tableNumber: number
  setShow: (show: boolean) => void
  showPayMethod: boolean
  setShowPayMethod: (show: boolean) => void
}

export const BillActions = ({ setShow, showPayMethod, setShowPayMethod, tableNumber }: Props) => {
  const { bill, saveBill, getTotalBill, addDiscount, getBillDiscount, needsCommand, getBillFromServer, initBill } = useBillStore()
  const [commandActionWait, setCommandActionWait] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [discountForm, setDiscountForm] = useState(false)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const { workDayId } = useWorkDayStore()

  const commandBill = async () => {
    const state = await saveBill()
    if (state) {
      setCommandActionWait(true)
    }
  }

  const stayBill = async () => {
    setCommandActionWait(false)
    await getBillFromServer(bill.id, 0, workDayId ?? '')
  }

  const getTotal = () => {
    const total = getTotalBill()

    return total
  }

  const onSetDiscountAmount = (value: string) => {
    //remove 0 at the beginning
    if (value.length > 1 && value[0] === '0') {
      value = value.slice(1)
    }
    const amount = parseFloat(value)

    if (isNaN(amount) || amount < 0) {
      setDiscountAmount(0)
      setDiscountPercent(0)
      return
    }

    setDiscountAmount(amount)
    const percent = (amount * 100) / getTotalBill()
    setDiscountPercent(percent)
  }

  const onSetDiscountPercent = (value: string) => {
    if (value.length > 1 && value[0] === '0') {
      value = value.slice(1)
    }
    const percent = parseFloat(value)

    if (isNaN(percent) || percent < 0) {
      setDiscountAmount(0)
      setDiscountPercent(0)
      return
    }

    if (percent > 100) return

    setDiscountPercent(percent)
    const amount = (getTotalBill() * percent) / 100
    setDiscountAmount(amount)
  }

  const handleSetDiscount = () => {
    addDiscount(discountAmount)
    setDiscountForm(false)
  }

  const closeBill = () => {
    setShow(false)
    initBill()
    setCommandActionWait(false)
  }
  useEffect(() => {
    setLoaded(true)
  }, [bill])

  return (
    <>
      {!loaded ? (
        <></>
      ) : (
        <>
          {needsCommand() ? (
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
              {!discountForm ? (
                <div className='w-3/5 font-bold select-none shadow-lg py-4 content-end h-full'>
                  {loaded && (
                    <>
                      <div className='w-full flex-wrap flex'>
                        <div className='w-3/5 pr-4 text-right'>Subtotal:</div>
                        <div className='w-2/5 text-left'>{currencyFormat(getTotalBill())}</div>
                      </div>
                      <div className='w-full flex-wrap flex'>
                        <div className='w-3/5 pr-4 text-right'>Impuesto:</div>
                        <div className='w-2/5 text-left'>¢0</div>
                      </div>
                      <div className='w-full flex-wrap flex'>
                        <div className='w-3/5 pr-4 text-right'>Descuento:</div>
                        <div className='w-2/5 flex-wrap flex justify-between items-center pr-2'>
                          {currencyFormat(getBillDiscount())}
                          {!showPayMethod && (
                            <HiMiniReceiptPercent
                              onClick={() => setDiscountForm(true)}
                              size={15}
                              className=' text-green-700 cursor-pointer hover:text-green-600 '
                            />
                          )}
                        </div>
                      </div>
                      <div className='w-full flex-wrap flex'>
                        <div className='w-3/5 pr-4 text-right'>Total:</div>
                        <div className='w-2/5 text-left'>{currencyFormat(getTotal())}</div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className='w-3/5 font-bold select-none shadow-lg py-4 justify-around flex flex-wrap content-end h-full'>
                  <div className='w-full justify-around flex-wrap flex mb-6'>
                    <div className='w-2/5 flex flex-wrap'>
                      <span className='text-left text-xs text-gray-700'>Porcentage</span>
                      <input
                        value={discountPercent}
                        onChange={(ev) => onSetDiscountPercent(ev.target.value)}
                        type='number'
                        className='w-full focus-visible:!outline-gray-400 select:border-gray-200 border text-xs p-2 text-gray-400 border-gray-300 rounded-lg'
                      />
                    </div>
                    <div className='w-2/5 flex flex-wrap'>
                      <span className='text-left text-xs text-gray-700'>Monto</span>
                      <input
                        value={discountAmount}
                        onChange={(ev) => onSetDiscountAmount(ev.target.value)}
                        type='number'
                        className='w-full focus-visible:!outline-gray-400 select:border-gray-200 border text-xs p-2 text-gray-400 border-gray-300 rounded-lg'
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSetDiscount()}
                    className='w-2/5 bg-green-800 text-white text-sm hover:bg-green-700 rounded-lg p-2'
                  >
                    Aplicar
                  </button>
                  <button
                    onClick={() => setDiscountForm(false)}
                    className='w-2/5 bg-red-800 text-white text-sm hover:bg-red-700 rounded-lg p-2'
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
