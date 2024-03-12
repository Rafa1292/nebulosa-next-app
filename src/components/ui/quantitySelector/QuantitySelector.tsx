'use client'

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5'

interface Props {
  plusClassName?: string
  minusClassName?: string
  quantity: number
  setQuantity: (quantity: number) => void
}

export const QuantitySelector = ({ quantity, setQuantity, plusClassName, minusClassName }: Props) => {

  const onValueChange = (value: number) => {
    if (value < 0) return

    setQuantity(value)
  }
  return (
    <div className='flex w-full justify-center gap-3'>
      <button className={`${minusClassName}`} onClick={() => onValueChange(quantity - 1)}>
        <IoRemoveCircleOutline size={20} />
      </button>
      <span className='text-center w-1/4 rounded'>{quantity}</span>
      <button className={plusClassName} onClick={() => onValueChange(quantity + 1)}>
        <IoAddCircleOutline size={20} />
      </button>
    </div>
  )
}
