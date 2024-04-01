'use client'

import { subTitleFont, titleFont } from '@/config/fonts'
import { BillItem } from '@/interfaces'
import { useBillStore } from '@/store'
import { currencyFormat } from '@/utils'
import clsx from 'clsx'
import { useState } from 'react'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { MdOutlineExpandCircleDown } from 'react-icons/md'
import { RiEdit2Fill } from 'react-icons/ri'

interface Props {
  billItem: BillItem
  handleEditBillItem: (billItem: BillItem) => void
  currentKey: number
}

export const BillItemUI = ({ billItem, handleEditBillItem, currentKey }: Props) => {
  const [showArticles, setShowArticles] = useState(false)
  const { removeBillItem, getItemArticleTotal, getBillItemTotal } = useBillStore()
  return (
    <div key={currentKey} className='flex flex-wrap mb-2 text-black transition-all cursor-pointer select-none items-center px-0  shadow-md rounded-md '>
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
        {currencyFormat(getBillItemTotal(billItem.saleItemId))}
      </div>
      <div className={`w-1/6 flex justify-center flex-wrap`}>
        <IoRemoveCircleOutline
          onClick={() => removeBillItem(billItem.saleItemId)}
          className={clsx('text-red-800', 'hover:!text-red-500')}
          size={22}
        />
        <RiEdit2Fill onClick={()=>handleEditBillItem(billItem)} className={clsx('text-black', 'hover:!text-gray-500')} size={20} />
        <MdOutlineExpandCircleDown
          onClick={() => setShowArticles(!showArticles)}
          className={clsx('text-black transition-all', 'hover:!text-gray-500', {
            'transform rotate-180': showArticles,
          })}
          size={22}
        />
      </div>
      <div
        className={`w-full shadow-inner  bg-gray-100 overflow-x-hidden overflow-scroll transition-all ${
          showArticles ? 'max-h-96 ' : 'max-h-0 p-0'
        }`}
      >
        {billItem.itemArticles!.map((itemArticle, index) => (
          <div
            key={index}
            className={clsx('flex flex-wrap w-full py-4', {
              'bg-white': index % 2 !== 0,
            })}
          >
            {itemArticle.linkedArticles !== undefined && (
              <>
                <div className='w-3/6 pl-2 flex flex-wrap'>
                  <div
                    className={`${subTitleFont.className} text-black antialiased text-center w-[15px] text-xs font-bold`}
                  >
                    {itemArticle.itemNumber})
                  </div>
                  <div
                    className={`${subTitleFont.className} text-gray-700 antialiased text-left pl-1 text-xs font-bold`}
                  >
                    {itemArticle.linkedArticles[0].name}
                  </div>
                </div>
                <div className={`${subTitleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}></div>
                <div className={`${subTitleFont.className}  antialiased text-black text-center w-1/6 text-xs font-bold`}>
                  {currencyFormat(getItemArticleTotal(itemArticle.itemNumber!, billItem.saleItemId))}
                </div>
                {/* modifiers */}
                <div className='w-full pt-1'>
                  {itemArticle.linkedArticles[0].modifiers?.map(
                    (modifier, index) =>
                      modifier.elements?.length! > 0 && (
                        <div key={index} className='flex flex-wrap w-full my-1'>
                          <div
                            className={`${titleFont.className}  antialiased text-left w-full pl-10 text-xs font-bold`}
                          >
                            {modifier.name}
                          </div>
                          {/* elements */}
                          {modifier.elements?.map((element, index) => (
                            <div className='w-full flex-wrap flex py-1' key={index}>
                              <div
                                className={`${titleFont.className}  text-gray-700 antialiased text-right pr-2 w-1/3 text-xs font-bold`}
                              >
                                {element.name}
                              </div>
                              <div
                                className={`${titleFont.className}  text-gray-700 antialiased text-center  w-1/6 text-xs font-bold`}
                              >
                                {element.quantity}
                              </div>
                              <div
                                className={`${titleFont.className}  text-gray-700 antialiased text-center  w-1/6 text-xs font-bold`}
                              >
                                {currencyFormat(element.price)}
                              </div>
                              <div
                                className={`${titleFont.className}  text-gray-700 antialiased text-center  w-1/6 text-xs font-bold`}
                              >
                                {currencyFormat(element.price * element.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
