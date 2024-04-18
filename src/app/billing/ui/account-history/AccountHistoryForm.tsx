'use client'

import { AccountHistory, PayMethod } from '@/interfaces'
import { usePayMethodStore } from '@/store'
import React, { useEffect, useState } from 'react'

interface Props {
  customClass?: string
  index?: number
  accountHistory: AccountHistory
  setAccountHistory: (accountHistory: AccountHistory, index?: number) => void
}

export const AccountHistoryForm = ({ customClass, accountHistory, setAccountHistory, index }: Props) => {
  const [payMethods, setPayMethods] = useState<PayMethod[]>([])
  const [amount, setAmount] = useState<number>(accountHistory.amount || 0)
  const [payMethodId, setPayMethodId] = useState<string>(accountHistory.payMethodId || '')

  const addAccountHistory = async () => {
    if (!payMethodId || !amount) return
    if(amount <= 0) return alert('El monto debe ser mayor a cero')
    const newAccountHistory: AccountHistory = {
      id: accountHistory.id,
      payMethodId,
      amount,
      currentBalance: 0,
      pay: false,
      previousBalance: 0
    }
    setAccountHistory(newAccountHistory, index)
  }

  useEffect(() => {
    const fetchPayMethods = async () => {
      const payMethods = await usePayMethodStore.getState().getPayMethodsFromStore()
      setPayMethods(payMethods)
    }
    fetchPayMethods()
  }, [])

  return (
    <div className={`shadow rounded-lg px-4 ${customClass}`}>
      <div className='flex flex-col mb-4'>
        <span className='font-bold text-sm antialiased'>Metodo de pago</span>
        <select className='p-2 border rounded-md bg-white' onChange={(ev) => setPayMethodId(ev.target.value)}>
          {accountHistory.payMethodId ? <option value=''>{payMethods.find(x => x.id === accountHistory.payMethodId)?.name}</option> : <option value=''>[Seleccione]</option>}
          {payMethods.map((payMethod) => (
            <option key={payMethod.id} value={payMethod.id}>
              {payMethod.name}
            </option>
          ))}
        </select>
      </div>
      <div className='flex flex-col mb-4'>
        <span className='font-bold antialiased text-sm'>Monto</span>
        <input type='number' className='p-2 border rounded-md bg-white' onChange={(ev) => setAmount(Number(ev.target.value))} value={amount} />
      </div>
      <div className='flex w-full mb-4'>
        <button className='bg-green-600 w-full text-white rounded-md p-2 hover:bg-green-800' onClick={()=> addAccountHistory()}>Agregar</button>
      </div>
    </div>
  )
}
