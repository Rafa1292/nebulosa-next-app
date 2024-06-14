'use client'

import { AccountHistoryForm } from '../../ui/account-history/AccountHistoryForm'
import { useState } from 'react'
import { AccountHistory, ExpenseAccountHistory, Provider } from '@/interfaces'
import { FaTrashAlt } from 'react-icons/fa'

const initialAccountHistory: AccountHistory = {
  id: '',
  amount: 0,
  currentBalance: 0,
  pay: false,
  payMethodId: '',
  previousBalance: 0,
}

interface Props {
  expenseAccountHistories: ExpenseAccountHistory[]
  addExpenseAccountHistory: (accountHistory: AccountHistory) => void
  setShowPayForm: (show: boolean) => void
}

export const PayExpenseForm = ({ expenseAccountHistories, addExpenseAccountHistory, setShowPayForm }: Props) => {
  const [accountHistory, setInitAccountHistory] = useState<AccountHistory>(initialAccountHistory)
  const [loading, setLoading] = useState<boolean>(false)

  const setAccountHistory = async (data: AccountHistory) => {
    setLoading(true)
    await setTimeout(() => {}, 1000)
    addExpenseAccountHistory(data)

    // const { ok, message } = await createExpense({ description, accountHistory: data })
    // alert(message)
    // if (ok) {
    //   setInitAccountHistory(initialAccountHistory)
    //   setDescription('')
    // }
    setLoading(false)
  }
  return (
    <>
      {!loading ? (
        <AccountHistoryForm accountHistory={accountHistory} setAccountHistory={setAccountHistory} allowAction={true} />
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
              <FaTrashAlt className='text-red-800 cursor-pointer text-xl hover:text-red-700' />
            </div>
          ))}
        </>
      )}
      <div className='w-full flex flex-wrap justify-around py-1'>
        <button onClick={() => setShowPayForm(false)} className='w-2/5 p-2 bg-gray-500 rounded-md text-white'>
          Atras
        </button>
        <button
          onClick={() => setAccountHistory(accountHistory)}
          className='w-2/5 p-2 bg-blue-600 rounded-md text-white'
        >
          Pagar
        </button>
      </div>
    </>
  )
}
