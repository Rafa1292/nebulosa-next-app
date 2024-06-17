'use client'

import { AccountHistoryForm } from '../../ui/account-history/AccountHistoryForm'
import { useState } from 'react'
import { AccountHistory, ExpenseAccountHistory, Provider } from '@/interfaces'
import { FaTrashAlt } from 'react-icons/fa'
import clsx from 'clsx'

const initialAccountHistory: AccountHistory = {
  id: '',
  amount: 0,
  currentBalance: 0,
  pay: false,
  payMethodId: '',
  previousBalance: 0,
}

interface Props {
  amount: number
  expenseAccountHistories: ExpenseAccountHistory[]
  addExpenseAccountHistory: (accountHistory: AccountHistory) => void
  removeExpenseAccountHistory: (accountHistory: AccountHistory | undefined) => void
  setShowPayForm: (show: boolean) => void
  addExpense: () => void
}

export const PayExpenseForm = ({
  expenseAccountHistories,
  addExpenseAccountHistory,
  setShowPayForm,
  amount,
  removeExpenseAccountHistory,
  addExpense
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)

  const setAccountHistory = async (data: AccountHistory) => {
    setLoading(true)
    await setTimeout(() => {}, 1000)
    addExpenseAccountHistory(data)
    setLoading(false)
  }

  const getDiference = () => {
    const currentHistoriesAmount = expenseAccountHistories.reduce(
      (acc, history) => acc + (history.accountHistory?.amount ?? 0),
      0
    )
    return amount - currentHistoriesAmount
  }

  const isPayOk = () => {
    const diference = getDiference()
    return diference === 0
  }

  return (
    <>
      {!loading ? (
        !isPayOk() && (
          <AccountHistoryForm
            accountHistory={initialAccountHistory}
            setAccountHistory={setAccountHistory}
            allowAction={!isPayOk()}
          />
        )
      ) : (
        <div className='flex justify-center items-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
      {expenseAccountHistories.length === 0 ? (
        <div className='w-full flex justify-center py-4'>
          <p className='text-red-600'>No hay formas de pago</p>
        </div>
      ) : (
        <>
          {expenseAccountHistories.map((history) => (
            <div key={history.accountHistory?.id} className='w-full flex justify-around py-1'>
              <p>{history.accountHistory?.payMethod?.name}</p>
              <p>{history.accountHistory?.amount}</p>
              <FaTrashAlt
                onClick={() => removeExpenseAccountHistory(history.accountHistory)}
                className='text-red-800 cursor-pointer text-xl hover:text-red-700'
              />
            </div>
          ))}
        </>
      )}
      <div className='w-full flex flex-wrap justify-around py-4'>
        <button
          onClick={() => setShowPayForm(false)}
          className='w-2/5 p-2 bg-transparent border hover:bg-black hover:text-white border-black rounded-md text-black'
        >
          Atras
        </button>
        <button
          disabled={!isPayOk()}
          onClick={addExpense}
          className={clsx(
            'w-2/5 p-2 bg-blue-600 rounded-md text-white',
            isPayOk() ? '' : 'bg-gray-500 cursor-not-allowed'
          )}
        >
          Pagar
        </button>
      </div>
    </>
  )
}
