'use client'

import { AccountHistory, PayMethod } from '@/interfaces'
import { usePayMethodStore } from '@/store'
import React, { useEffect, useState } from 'react'

interface Props {
  customClass?: string
  index?: number
  accountHistory: AccountHistory
  allowAction?: boolean
  defaultAmount?: number
  setAccountHistory: (accountHistory: AccountHistory, index?: number) => void
  removeAccountHistory?: (index: number) => void
}

export const AccountHistoryForm = ({
  customClass,
  accountHistory,
  setAccountHistory,
  index,
  allowAction = true,
  defaultAmount,
  removeAccountHistory,
}: Props) => {
  const [payMethods, setPayMethods] = useState<PayMethod[]>([])
  const [amount, setAmount] = useState<number>(accountHistory.amount || 0)
  const [payMethodId, setPayMethodId] = useState<string>(accountHistory.payMethodId || '')
  const [currentIndex, setCurrentIndex] = useState<number>(index || 0)
  const [loaded, setLoaded] = useState(false)

  const addAccountHistory = async () => {
    if (!payMethodId || !amount) return alert('Debe seleccionar un metodo de pago y un monto')
    if (amount <= 0) return alert('El monto debe ser mayor a cero')
    const newAccountHistory: AccountHistory = {
      id: accountHistory.id,
      payMethodId,
      amount,
      currentBalance: 0,
      pay: false,
      previousBalance: 0,
      payMethod: payMethods.find((x) => x.id === payMethodId),
    }
    setAccountHistory(newAccountHistory, index)
  }

  useEffect(() => {
    const fetchPayMethods = async () => {
      const payMethods = await usePayMethodStore.getState().getPayMethodsFromStore()
      setPayMethods(payMethods)
    }
    fetchPayMethods()
    setLoaded(true)
  }, [])

  return (
    <>
      {!loaded ? (
        <></>
      ) : (
        <div className={`shadow rounded-lg px-4 ${customClass}`}>
          <div className='flex flex-col mb-4'>
            <span className='font-bold text-sm antialiased select-none'>Metodo de pago</span>
            <select
              disabled={!allowAction}
              className='p-2 border rounded-md bg-white select-none'
              onChange={(ev) => setPayMethodId(ev.target.value)}
            >
              {accountHistory.payMethodId ? (
                <option value=''>{payMethods.find((x) => x.id === accountHistory.payMethodId)?.name}</option>
              ) : (
                <option value=''>[Seleccione]</option>
              )}
              {payMethods.map((payMethod) => (
                <option key={payMethod.id} value={payMethod.id}>
                  {payMethod.name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col mb-4'>
            <span className='font-bold antialiased text-sm select-none'>Monto</span>
            <input
            onDoubleClick={() => setAmount(defaultAmount || 0)}
              disabled={!allowAction}
              type='number'
              className='p-2 border rounded-md bg-white select-none'
              onChange={(ev) => setAmount(Number(ev.target.value))}
              value={amount}
            />
          </div>
          {allowAction ? (
            <div className='flex w-full mb-4'>
              <button
                className='bg-green-600 w-full text-white rounded-md p-2 hover:bg-green-800 select-none'
                onClick={() => addAccountHistory()}
              >
                Agregar
              </button>
            </div>
          ) : (
            <div className='flex w-full flex-wrap gap-4 mb-4'>
              <button
                className='bg-red-600 w-full text-white rounded-md p-2 hover:bg-red-800 select-none'
                onClick={removeAccountHistory ? () => removeAccountHistory(currentIndex ?? 0) : () => {}}
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
