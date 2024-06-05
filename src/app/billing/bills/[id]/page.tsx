'use server'

import { getBillById } from '@/actions/bill/get-bill'
import { BillItemHeader } from '../../ui/bill/BillItemHeader'
import { BillItemUI } from '../../ui/bill/BillItem'
import { currencyFormat, getBillDiscount, getTotalBill } from '@/utils'

interface Props {
  params: {
    id: string
  }
}

export default async function BillByIdPage({ params }: Props) {
  const { id } = params
  const { bill } = await getBillById(id)

  const getAddress = () => {
    if (bill?.addressId === '') return 'No hay direccion'
    if (bill?.customer.addresses) {
      const address = bill.customer.addresses.find((address) => address.id === bill.addressId)
      return address?.description
    }

    return 'No hay direccion'
  }

  if (!bill) return <div>Bill not found</div>

  return (
    <div className='w-full flex flex-wrap pt-8 justify-center'>
      <div className='w-3/4 md:w-2/4 p-4 shadow-lg bg-gray-50 rounded-lg'>
        <div className='w-full flex flex-wrap'>
          <span className='w-full text-left'>{bill?.customer.name}</span>
          <span className='w-full text-left'>{bill?.customer?.phone}</span>
          <span className='w-full text-left'>{getAddress()}</span>
        </div>
        {(bill?.items?.length ?? 0) > 0 ? (
          <>
            {/* header 5%*/}
            <BillItemHeader />
            {/* items */}
            <div className='w-full flex flex-col min-h-[30vh]  overflow-scroll gap-2'>
              {bill?.items!.map((billItem, index) => (
                <BillItemUI bill={bill} currentKey={index} key={index} billItem={billItem} />
              ))}
            </div>
          </>
        ) : (
          <div className='w-full flex justify-center items-center h-3/5'>
            <div className='text-3xl text-gray-500'>No hay items en la cuenta</div>
          </div>
        )}
        <div className='w-full flex justify-end'>
          <div className='w-2/5 flex flex-wrap'>
            <div className='w-full justify-end flex-wrap flex'>
              <div className='w-3/5 pr-4 text-right'>Subtotal:</div>
              <div className='w-2/5 text-left'>{currencyFormat(getTotalBill(bill))}</div>
            </div>
            <div className='w-full justify-end flex-wrap flex'>
              <div className='w-3/5 pr-4 text-right'>Impuesto:</div>
              <div className='w-2/5 text-left'>¢0</div>
            </div>
            <div className='w-full justify-end flex flex-wrap'>
              <div className='w-3/5 pr-4 text-right'>Descuento:</div>
              <div className='w-2/5 text-left'>{currencyFormat(getBillDiscount(bill))}</div>
            </div>
            <div className='w-full justify-end flex-wrap flex'>
              <div className='w-3/5 pr-4 text-right'>Total:</div>
              <div className='w-2/5 text-left'>{currencyFormat(getTotalBill(bill))}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
