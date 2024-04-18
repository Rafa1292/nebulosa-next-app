'use client'

import { IoAddCircleOutline, IoCloseCircleOutline } from 'react-icons/io5'
import { AccountHistoryForm } from '../account-history/AccountHistoryForm'
import { AccountHistory } from '@/interfaces'
import { useBillStore } from '@/store'
import { useEffect, useState } from 'react'

const newAccountHistory: AccountHistory = {
  id: '',
  amount: 0,
  currentBalance: 0,
  pay: false,
  payMethodId: '',
  previousBalance: 0,
}

export const BillPayMethodComplete = () => {
  const { bill, addBillAccountHistory, removeBillAccountHistory } = useBillStore()
  const [currentAccountHistory, setCurrentAccountHistory] = useState<AccountHistory>(newAccountHistory)
  const [loader, setLoader] = useState<boolean>(false)

  const addAccountHistory = async (accountHistory: AccountHistory, index?: number) => {
    setLoader(true)
    await addBillAccountHistory(accountHistory, index)
    setCurrentAccountHistory(newAccountHistory)
    setLoader(false)
  }

  const handleRemoveBillAccountHistory = async (index: number) => {
    setLoader(true)
    await removeBillAccountHistory(index)
    setLoader(false)
  }

  return (
    <div className='w-full flex flex-wrap justify-left pt-6'>
      {/* <div className='w-full justify-center flex py-8'>
        <button
          className={'rounded-full h-[60px] w-[60px] p-0 shadow-xl hover:bg-black hover:text-white hover:shadow-none'}
        >
          <IoAddCircleOutline size={60} onClick={() => addAccountHistory()} />
        </button>
      </div> */}
      {!loader && (
        <>
          <div className=' w-[44%] mx-[3%] flex flex-col justify-center items-center mb-6'>
            <AccountHistoryForm
              setAccountHistory={(accountHistory) =>
                addAccountHistory(accountHistory, bill.histories?.length ?? +1 ?? 0)
              }
              accountHistory={currentAccountHistory}
              customClass='w-full'
            />
          </div>
          {bill.histories?.map((history, index) => (
            <div key={index} className=' w-[44%] mx-[3%] flex flex-col justify-center items-center mb-6 relative'>
              <IoCloseCircleOutline
                onClick={() => handleRemoveBillAccountHistory(index)}
                className=' cursor-pointer text-4xl z-50 absolute text-red-800 -right-4 -top-4 hover:text-red-700'
              />
              <AccountHistoryForm
                setAccountHistory={addAccountHistory}
                accountHistory={history.accountHistory ?? newAccountHistory}
                customClass='w-full'
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
