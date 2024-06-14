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
  const { bill,payBill, getTotalBill, getTotalHistories, addBillAccountHistory, removeBillAccountHistory } = useBillStore()
  const [currentAccountHistory, setCurrentAccountHistory] = useState<AccountHistory>(newAccountHistory)
  const [loader, setLoader] = useState<boolean>(false)

  const addAccountHistory = async (accountHistory: AccountHistory, index?: number) => {
    setLoader(true)
    const diference = getTotalBill() - getTotalHistories()
    if (diference >= accountHistory.amount) {
      await addBillAccountHistory(accountHistory, index)
      setCurrentAccountHistory(newAccountHistory)
    } else {
      alert('El monto no puede ser mayor al total de la factura')
    }
    setLoader(false)
  }

  const getDiference = () => {
    return getTotalBill() - getTotalHistories()
  }

  const handleRemoveBillAccountHistory = async (index: number) => {
    setLoader(true)
    await removeBillAccountHistory(index)
    setLoader(false)
  }

  const payCurrentBill = async () => {
    const isPaid = await payBill()
    if (isPaid) {
      alert('Factura pagada')
    } else {
      alert('Error al pagar la factura')
    }
  }



  return (
    <div className='w-full flex flex-wrap justify-left py-6 overflow-x-hidden max-h-[90%] overflow-scroll'>
      {/* <div className='w-full justify-center flex py-8'>
        <button
          className={'rounded-full h-[60px] w-[60px] p-0 shadow-xl hover:bg-black hover:text-white hover:shadow-none'}
        >
          <IoAddCircleOutline size={60} onClick={() => addAccountHistory()} />
        </button>
      </div> */}
      {!loader && (
        <>
          {getDiference() > 0 && (
            <>
              <div className=' w-[44%] mx-[3%] flex flex-col justify-center items-center mb-6'>
                <AccountHistoryForm
                defaultAmount={getTotalBill()}
                  setAccountHistory={(accountHistory) =>
                    addAccountHistory(accountHistory, bill.histories?.length ?? +1 ?? 0)
                  }
                  accountHistory={currentAccountHistory}
                  customClass='w-full'
                />
              </div>
            </>
          )}
          {bill.histories?.map((history, index) => (
            <div key={index} className=' w-[44%] mx-[3%] flex flex-col justify-center items-center mb-6 relative'>
              <AccountHistoryForm
                removeAccountHistory={handleRemoveBillAccountHistory}
                allowAction={false}
                setAccountHistory={addAccountHistory}
                accountHistory={history.accountHistory ?? newAccountHistory}
                customClass='w-full'
                index={index}
              />
            </div>
          ))}
        </>
      )}
      {getDiference() === 0 && (
        <div className='w-full absolute bottom-0 left-0'>
          <button
            className='bg-green-600 w-full text-white p-2 hover:bg-green-800 select-none py-4'
            onClick={getDiference() === 0 ? () => payBill() : () => {}}
          >
            Pagar
          </button>
        </div>
      )}
    </div>
  )
}
