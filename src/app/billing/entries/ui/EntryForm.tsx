'use client'

import { createEntry } from '@/actions'
import { AccountHistoryForm } from '../../ui/account-history/AccountHistoryForm'
import { useState } from 'react'
import { AccountHistory } from '@/interfaces'

const initialAccountHistory: AccountHistory = {
  id: '',
  amount: 0,
  currentBalance: 0,
  pay: false,
  payMethodId: '',
  previousBalance: 0,
}

export const EntryForm = () => {
  const [accountHistory, setInitAccountHistory] = useState<AccountHistory>(initialAccountHistory)
  const [description, setDescription] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const setAccountHistory = async (data: AccountHistory) => {
    setLoading(true)
    if (!description) {
      alert('Debes agregar una descripcion')
      return
    }

    const { ok, message } = await createEntry({ description, accountHistory: data })
    alert(message)
    if (ok) {
      setInitAccountHistory(initialAccountHistory)
      setDescription('')
    }
    setLoading(false)
  }
  return (
    <div className='flex h-[300px] flex-wrap w-[300px] p-4 justify-center rounded-xl border border-gray-600'>
      {!loading ? (
        <>
          <textarea
            onChange={(ev) => setDescription(ev.target.value)}
            className='p-2 mx-2 w-full mb-4 text-xs border rounded-md bg-gray-100'
            placeholder='Descripcion'
          />
          <AccountHistoryForm
            accountHistory={accountHistory}
            setAccountHistory={setAccountHistory}
            allowAction={true}
          />
        </>
      ):
      (
        <div className='flex justify-center items-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
    </div>
  )
}
