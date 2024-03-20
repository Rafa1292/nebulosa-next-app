'use client'

import { titleFont } from '@/config/fonts'
import { ArticleModifierGroup, SaleItem } from '@/interfaces'
import clsx from 'clsx'
import { useEffect } from 'react'
import { IoAddCircleOutline, IoCloseCircleOutline } from 'react-icons/io5'
import { useBillItemStore } from '@/store'
import { BillArticle } from './BillArticle'

interface Props {
  saleItem: SaleItem | null
  setSaleItem: (saleItem: SaleItem | null) => void
}

export const BillArticles = ({ saleItem, setSaleItem }: Props) => {
  const { addBillItemArticle, billItem } = useBillItemStore()

  const closeModal = () => {
    setSaleItem(null)
  }

  useEffect(() => {
    if (saleItem !== null) {
    }
  }, [saleItem, billItem?.itemArticles])

  return (
    <div
      className={clsx('absolute h-screen w-3/5 transition-all translate-y-full bottom-0 z-20 left-0', {
        '!translate-y-0': saleItem !== null,
      })}
    >
      <div
        onClick={() => setSaleItem(null)}
        className={clsx(
          'w-full backdrop-filter cursor-not-allowed delay-100 duration-500 transition-all backdrop-blur-md z-10 bg-black opacity-0 h-1/5',
          {
            'opacity-40': saleItem !== null,
          }
        )}
      ></div>
      <div className={clsx('h-4/5 w-full bg-white z-20 relative', {})}>
        <IoCloseCircleOutline
          onClick={() => closeModal()}
          className='cursor-pointer z-50 text-4xl absolute text-red-800 right-3 top-3 hover:text-red-700'
        />
        <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2 flex-wrap'>
          <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>
            Cantidad
          </div>
          <div className='w-1/4 justify-center flex flex-wrap'>
            <div className={`${titleFont.className}  antialiased text-center text-md w-full font-bold`}>
              {(billItem?.itemArticles?.length ?? 1) / (saleItem?.saleItemArticles?.length ?? 1)}
            </div>
            <button className='hover:bg-black p-0 hover:!text-white rounded-2xl' onClick={() => addBillItemArticle(saleItem!)}>
              <IoAddCircleOutline size={30} />
            </button>
          </div>
        </div>
        <BillArticle saleItem={saleItem} />
      </div>
    </div>
  )
}
