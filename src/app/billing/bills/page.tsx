'use server'

import { getBillsByWorkDayId } from '@/actions/bill/get-bills-by-work-day'
import { currencyFormat, getTotalBill } from '@/utils'
import clsx from 'clsx'
import { BillActions } from './ui/BillActions'

export default async function BillsPage() {
  const { bills } = await getBillsByWorkDayId()

  return (
    <div className='w-full wrap h-screen overflow-scroll pb-10'>
      <div className='w-full flex justify-center'>
        <h1 className='text-2xl font-bold py-8'>Facturas</h1>
      </div>
      {!bills ? (
        <div className='w-full flex justify-center'>
          <p>No hay facturas</p>
        </div>
      ) : (
        <div className='w-full flex justify-center'>
          <div className='w-10/12 relative overflow-x-auto'>
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'></th>
                  <th scope='col' className='px-6 py-3'>
                    Mesa
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Cliente
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Fecha
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Estado
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Total
                  </th>
                  <th scope='col' className='px-6 py-3'></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr
                    className={clsx('bg-white border-b dark:bg-gray-800 dark:border-gray-700', {
                      'line-through text-red-600': bill.isNull,
                    })}
                    key={bill.id}
                  >
                    <td className='px-6 py-4'>
                      <span
                        className={clsx('h-[10px] w-[10px] rounded-full flex', {
                          'bg-green-500 shadow-[0px_0px_8px_-1px_#22c55e]': !bill.closed,
                          'bg-red-900 shadow-[0px_0px_8px_-1px_#7f1d1d]': bill.closed,
                        })}
                      ></span>
                    </td>
                    <td className='px-6 py-4'>{bill.tableNumber}</td>
                    <th scope='row' className='px-6 py-4 font-medium whitespace-nowrap '>
                      Rafa
                    </th>
                    <td className='px-6 py-4'>{bill.commandTime.toLocaleTimeString()}</td>
                    <td className='px-6 py-4'>{ bill.isNull ? 'Anulada' : bill.closed ? 'Cerrada' : 'Abierta'}</td>
                    <th scope='row' className='px-6 py-4 font-medium whitespace-nowrap '>
                      {currencyFormat(getTotalBill(bill))}
                    </th>
                    <BillActions billId={bill.id} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
