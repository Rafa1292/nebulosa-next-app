'use client'

import { titleFont } from '@/config/fonts'
import { BillItem } from '@/interfaces'
import { currencyFormat } from '@/utils'
import clsx from 'clsx'
import { useState } from 'react'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { MdOutlineExpandCircleDown } from 'react-icons/md'

interface Props {
  billItem: BillItem
}

export const BillItemUI = ({ billItem }: Props) => {
  const [showArticles, setShowArticles] = useState(false)

  return (
    <div className='flex flex-wrap text-black transition-all cursor-pointer select-none items-center px-0 border-y-2 shadow-xl rounded-md border-white'>
      <div className={`${titleFont.className}  antialiased py-2 text-center w-1/6 text-xs font-bold`}>
        {billItem.description}
      </div>
      <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>
        {billItem.discount}
      </div>
      <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>
        {billItem.quantity}
      </div>
      <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>
        {currencyFormat(billItem.unitPrice)}
      </div>
      <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>
        {currencyFormat(billItem.unitPrice * billItem.quantity)}
      </div>
      <div className={`w-1/6 flex flex-wrap`}>
        <IoRemoveCircleOutline className={clsx('text-red-800', 'hover:!text-red-500')} size={25} />
        <MdOutlineExpandCircleDown
          onClick={() => setShowArticles(!showArticles)}
          className={clsx('text-black transition-all', 'hover:!text-gray-500', {
            'transform rotate-180': showArticles,
          })}
          size={25}
        />
      </div>
      <div className={`w-full shadow-inner  bg-gray-100 overflow-x-hidden overflow-scroll transition-all ${showArticles ? 'max-h-60 py-2' : 'max-h-0 p-0'}`}>
        {billItem.itemArticles!.map((itemArticle, index) => (
          <div key={index} className='flex flex-wrap w-full'>
            {itemArticle.linkedArticles !== undefined && (
              <>
                <div className={`${titleFont.className}  antialiased text-center w-1/2 text-xs font-bold`}>
                  {itemArticle.linkedArticles[0].name}
                </div>
                <div className={`${titleFont.className}  antialiased text-center w-1/2 text-xs font-bold`}>
                  {itemArticle.linkedArticles[0].unitPrice}
                </div>
                <div className="w-full">
                    {
                        itemArticle.linkedArticles[0].modifiers?.map((modifier, index) => (
                            <div key={index} className='flex flex-wrap w-full'>
                                <div className={`${titleFont.className}  antialiased text-center w-1/2 text-xs font-bold`}>
                                    {modifier.name}
                                </div>
                            </div>
                        ))
                    }
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
