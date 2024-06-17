'use client'

import { useState } from 'react'
import { AccountHistory, ExpenseAccountHistory, Provider } from '@/interfaces'
import clsx from 'clsx'
import { PayExpenseForm } from './PayExpenseForm'
import { createExpense } from '@/actions'

interface Props {
  providers: Provider[]
}

const initialExpenseAccountHistory: ExpenseAccountHistory = {
  accountHistoryId: '',
  expenseId: '',
  id: '',
}

export const ExpenseForm = ({ providers }: Props) => {
  const [description, setDescription] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const [providerId, setProviderId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [expenseAccountHistories, setExpenseAccountHistories] = useState<ExpenseAccountHistory[]>([])
  const [showPayForm, setShowPayForm] = useState<boolean>(false)

  const addExpenseAccountHistory = (accountHistory: AccountHistory) => {
    const currentHistoriesAmount = expenseAccountHistories.reduce(
      (acc, history) => acc + (history.accountHistory?.amount ?? 0),
      0
    )
    const diference = amount - currentHistoriesAmount
    if (diference >= accountHistory.amount) {
      setExpenseAccountHistories([...expenseAccountHistories, { ...initialExpenseAccountHistory, accountHistory }])
    } else {
      alert('El monto de la historia de cuenta es mayor al monto restante')
    }
  }

  const removeExpenseAccountHistory = (accountHistory: AccountHistory | undefined) => {
    if (!accountHistory) return
    const newHistories: ExpenseAccountHistory[] = []
    let isRemoved = false
    for (const history of expenseAccountHistories) {
      if (
        !isRemoved &&
        history.accountHistory?.payMethodId === accountHistory.payMethodId &&
        history.accountHistory?.amount === accountHistory.amount
      ) {
        isRemoved = true
      } else {
        newHistories.push(history)
      }
    }
    setExpenseAccountHistories(newHistories)
  }

  const addExpense = async () => {
    const { ok, message } = await createExpense({ isNull: false, pendingPay: false, description, amount, providerId, expenseAccountHistories })

    if (ok) {
      setDescription('')
      setAmount(0)
      setProviderId('')
      setExpenseAccountHistories([])
      setShowPayForm(false)
    } else {
      alert(message)
    }
  }

  return (
    <div className='flex h-fit content-center flex-wrap w-[300px] p-4 justify-center rounded-xl border border-gray-600'>
      {!loading ? (
        <>
          {!showPayForm ? (
            <>
              <input
                value={amount}
                onChange={(ev) => setAmount(Number(ev.target.value))}
                className='p-2 h-fit w-full mx-2 mb-4 text-xs border rounded-md bg-gray-100'
                type='number'
                placeholder='Monto'
              />
              <select
                onChange={(ev) => setProviderId(ev.target.value)}
                className='p-2 text-gray-500 h-fit mb-4 text-xs w-full mx-2 border rounded-md bg-gray-100'
              >
                <option value=''>Proveedor</option>
                {providers.map((provider) => (
                  <option key={provider.id} 
                  // selected={provider.id === providerId} 
                  defaultValue={providerId}
                  value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              <textarea
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
                className='p-2 h-fit mx-2 w-full mb-4 text-xs border rounded-md bg-gray-100'
                placeholder='Descripcion'
              />
              <button
                disabled={amount === 0 || providerId === ''}
                onClick={() => setShowPayForm(!showPayForm)}
                className={clsx('p-2 w-full mx-2 bg-green-700 hover:bg-green-600 text-white rounded-md', {
                  'bg-gray-500 hover:bg-gray-500 cursor-not-allowed': amount === 0 || providerId === '',
                })}
              >
                Siguiente
              </button>
            </>
          ) : (
            <PayExpenseForm
              addExpense={addExpense}
              removeExpenseAccountHistory={removeExpenseAccountHistory}
              amount={amount}
              setShowPayForm={setShowPayForm}
              expenseAccountHistories={expenseAccountHistories}
              addExpenseAccountHistory={addExpenseAccountHistory}
            />
          )}
        </>
      ) : (
        <div className='flex justify-center items-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
    </div>
  )
}
