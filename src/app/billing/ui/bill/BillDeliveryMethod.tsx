'use client'
import clsx from 'clsx'
import { FaPersonWalkingLuggage } from 'react-icons/fa6'
import { MdDeliveryDining, MdDinnerDining } from 'react-icons/md'
import { useBillStore } from '@/store'
import { useEffect } from 'react'

export const BillDeliveryMethod = () => {
  const { setDeliveryMethod, bill } = useBillStore()


  return (
    <div className='w-full flex-wrap h-[10vh] items-center gap-3 justify-center flex'>
      <MdDeliveryDining
        onClick={() => setDeliveryMethod('Domicilio')}
        className={clsx('border-black border rounded-lg p-1 hover:text-white hover:bg-black', {
          'bg-black !text-white': bill.deliveryMethod === 'Domicilio',
        })}
        size={45}
      />
      <FaPersonWalkingLuggage
        onClick={() => setDeliveryMethod('Recoger')}
        className={clsx('border-black border rounded-lg p-1 hover:text-white hover:bg-black', {
          'bg-black !text-white': bill.deliveryMethod === 'Recoger',
        })}
        size={45}
      />
      <MdDinnerDining
        onClick={() => setDeliveryMethod('Mesa')}
        className={clsx('border-black border rounded-lg p-1 hover:text-white hover:bg-black', {
          'bg-black !text-white': bill.deliveryMethod === 'Mesa',
        })}
        size={45}
      />
    </div>
  )
}
