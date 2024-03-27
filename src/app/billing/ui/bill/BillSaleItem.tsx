'use client'

import { titleFont } from '@/config/fonts'
import { ArticleModifierGroup, SaleItem } from '@/interfaces'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { IoAddCircleOutline, IoCloseCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5'
import { useBillItemStore } from '@/store'
import { BillArticle } from './BillArticle'
import { currencyFormat } from '@/utils'

interface Props {
  saleItem: SaleItem | null
  setSaleItem: (saleItem: SaleItem | null) => void
}

export const BillSaleItem = ({ saleItem, setSaleItem }: Props) => {
  const { addBillItemArticle, billItem, removeBillItemArticle } = useBillItemStore()
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [itemNumber, setItemNumber] = useState(1)
  const [nextItemNumber, setNextItemNumber] = useState(2)

  const fillSaleItems = () => {
    const itemArticlesCount = saleItem?.saleItemArticles?.length ?? 1
    const currentItemsOnBill = billItem?.itemArticles?.length ?? 1
    const quantity = currentItemsOnBill / itemArticlesCount
    const tmpSaleItems: SaleItem[] = []
    for (let i = 0; i < quantity; i++) {
      tmpSaleItems.push(saleItem!)
    }
    setNextItemNumber(tmpSaleItems.length + 1)
    setSaleItems(tmpSaleItems ?? [])
  }

  const closeModal = () => {
    setSaleItem(null)
  }

  useEffect(() => {
    if (saleItem !== null) {
      fillSaleItems()
    }
  }, [saleItem, billItem?.itemArticles, itemNumber])

  return (
    <div
      className={clsx('absolute h-screen w-3/5 transition-all translate-y-full bottom-0 z-20 left-0', {
        '!translate-y-0': saleItem !== null,
      })}
    >
      {/*backdrop*/}
      <div
        style={{ height: '5vh' }}
        onClick={() => setSaleItem(null)}
        className={clsx(
          'w-full backdrop-filter cursor-not-allowed delay-100 duration-500 transition-all backdrop-blur-md z-10 bg-black opacity-0',
          {
            'opacity-40': saleItem !== null,
          }
        )}
      ></div>
      {/*Close button*/}
      <div
        style={{ height: '95vh' }}
        className={clsx(' w-full bg-white z-20 relative overflow-x-hidden overflow-scroll', {})}
      >
        <div 
        style={{top: '5vh'}}
        className='w-full fixed z-30 h-8 bg-white'>
        </div>
        <div
          onClick={() => closeModal()}
          className={`${titleFont.className} bg-white px-4 py-1 rounded-xl select-none cursor-pointer z-50 text-sm fixed text-red-800 right-6 top-12 hover:text-red-700`}
        >
          Cerrar
        </div>
        <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2 pt-10 flex-wrap'>
          <div className='w-1/6 justify-center items-center flex flex-wrap'>
            <button
              className='hover:bg-black p-0 h-8 hover:!text-white rounded-2xl'
              onClick={() => addBillItemArticle(saleItem!, nextItemNumber)}
            >
              <IoAddCircleOutline size={30} />
            </button>
          </div>
          {saleItems?.map((currentSaleItem, index) => (
            <div
              onClick={() => setItemNumber(index + 1)}
              key={index}
              className={clsx(
                'flex relative flex-wrap bg-black w-1/6 text-white cursor-pointer select-none h-20 items-center px-3 py-4 border-y-2 shadow-xl rounded-md border-white',
                'hover:bg-white hover:border-gray-900 hover:!text-black',
                {
                  'bg-white !border-gray-900 !text-black': itemNumber === index + 1,
                }
              )}
            >
              <div
                className={clsx(
                  'absolute bg-white text-black shadow-md border-gray-200 border justify-center items-center flex -top-2 -right-2 w-6 h-6 rounded-2xl',
                  { '!bg-black !text-white': itemNumber === index + 1 }
                )}
              >
                <div className={`${titleFont.className}  antialiased  text-center w-full text-xs font-bold`}>
                  {index + 1}
                </div>
              </div>
              {nextItemNumber > 2 && (
                <div
                  className={clsx(
                    'absolute hover:bg-red-800 bg-white text-black shadow-md border-gray-200 border justify-center items-center flex -top-2 right-4 w-6 h-6 rounded-2xl'
                  )}
                >
                  <IoRemoveCircleOutline
                    onClick={() => removeBillItemArticle(index + 1)}
                    className={clsx('text-red-800', 'hover:!text-white ')}
                    size={25}
                  />
                </div>
              )}
              <div className={`${titleFont.className}  antialiased text-center w-full text-xs font-bold`}>
                {currentSaleItem.name}
              </div>
              {currentSaleItem.currentMenuPrice !== undefined && currentSaleItem.currentMenuPrice > 0 ? (
                <div className={`${titleFont.className}  antialiased text-center w-full text-xs font-bold`}>
                  {currencyFormat(currentSaleItem.currentMenuPrice ?? 0)}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        {saleItem !== null && <BillArticle closeModal={closeModal} saleItem={saleItem} itemNumber={itemNumber} />}
      </div>
    </div>
  )
}
