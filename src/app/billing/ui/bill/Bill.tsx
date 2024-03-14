'use client'

import { titleFont } from '@/config/fonts'
import { Menu, SaleItem, SaleItemCategory } from '@/interfaces'
import clsx from 'clsx'
import { useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BillArticles } from './BillArticles'

interface Props {
  saleItemCategories: SaleItemCategory[]
  menus: Menu[]
  show?: boolean
  setShow: (show: boolean) => void
}

export const Bill = ({ show = true, setShow, menus, saleItemCategories }: Props) => {
  const [saleItemCategory, setSaleItemCategory] = useState<SaleItemCategory | null>(null)
  const [saleItem, setSaleItem] = useState<SaleItem | null>(null)

  return (
    <div
      style={{ height: '0vh', width: '0vw' }}
      className={clsx('bg-white absolute top-0 left-0 overflow-hidden transition-all flex ', {
        '!h-screen !w-screen': show,
      })}
    >
      <IoCloseCircleOutline
        onClick={() => setShow(false)}
        className=' cursor-pointer text-4xl z-50 absolute text-red-800 right-3 top-3 hover:text-red-700'
      />
      <div className='w-3/5 bg-gray-100'>
        <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2'>
          {menus.map((menu, index) => (
            <div
              key={index}
              className='flex bg-red-800 text-white cursor-pointer select-none hover:bg-white hover:border-gray-900 hover:!text-black justify-between px-3 py-1 border-y-2 shadow-xl rounded-xl border-white'
            >
              <div className={`${titleFont.className}  antialiased text-xs font-bold`}>{menu.name}</div>
            </div>
          ))}
        </div>
        <div className='w-full flex gap-2 px-2 shadow-md py-3'>
          {saleItemCategories.map((saleItemCategory, index) => (
            <div
              onClick={() => setSaleItemCategory(saleItemCategory)}
              key={index}
              className='flex bg-black text-white cursor-pointer select-none hover:bg-white hover:border-gray-900 hover:!text-black justify-center px-3 py-1 border-y-2 shadow-xl rounded-md border-white'
            >
              <div className={`${titleFont.className} text-center  antialiased text-xs font-bold`}>{saleItemCategory.name}</div>
            </div>
          ))}
        </div>
        {saleItemCategory?.saleItems !== undefined ? (
          saleItemCategory.saleItems.length > 0 ? (
            <div className='w-full flex gap-2 px-2 py-3'>
              {saleItemCategory?.saleItems?.map((saleItem, index) => (
                <div
                  onClick={() => setSaleItem(saleItem)}
                  key={index}
                  className='flex bg-black w-1/6 text-white cursor-pointer select-none h-14 items-center px-3 py-1 border-y-2 shadow-xl rounded-md border-white
                 hover:bg-white hover:border-gray-900 hover:!text-black'
                >
                  <div className={`${titleFont.className}  antialiased text-center w-full text-xs font-bold`}>
                    {saleItem.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='w-full flex justify-center items-center h-3/5'>
              <div className='text-3xl text-gray-500'>No hay items de venta</div>
            </div>
          
          )
        ) : null}
        <BillArticles setSaleItem={setSaleItem} saleItem={saleItem}/>
      </div>
      <div className='w-2/5 shadow-2xl bg-white h-screen z-40'></div>
    </div>
  )
}
