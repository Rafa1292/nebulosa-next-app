'use client'

import Image from 'next/image'

interface Props {
  tableNumber?: number
  onClickEvent?: () => void
}

export const Table = ({tableNumber, onClickEvent}:Props) => {
  return (
    <>
    <div onClick={onClickEvent} className=' rounded-full relative bg-black w-[100px] h-[100px] cursor-pointer flex-wrap flex justify-center items-center'>
      <Image src='/dish.png' alt='Dish' width={80} height={80} />
      <span className='absolute'>{tableNumber}</span>
    </div>
    </>
  )
}
