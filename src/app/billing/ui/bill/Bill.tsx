'use client'

import { titleFont } from '@/config/fonts'
import { Menu, SaleItem, SaleItemCategory } from '@/interfaces'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BillArticles } from './BillArticles'
import { useBillItemStore } from '@/store'
import { currencyFormat } from '@/utils'
import { BillSaleItem } from './BillSaleItem'

interface Props {
  saleItemCategories: SaleItemCategory[]
  menus: Menu[]
  show?: boolean
  setShow: (show: boolean) => void
}

export const Bill = ({ show = true, setShow, menus, saleItemCategories }: Props) => {
  const { addBillItem } = useBillItemStore()
  const [saleItemCategory, setSaleItemCategory] = useState<SaleItemCategory | null>(null)
  const [saleItem, setSaleItem] = useState<SaleItem | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [saleItemCategoriesWithPrice, setSaleItemCategoriesWithPrice] = useState<SaleItemCategory[]>([])
  
  const handleSetSaleItem = (saleItem: SaleItem) => {
    addBillItem(saleItem, 1)
    setSaleItem(saleItem)
  }

  const handleChangeMenu = (menu: Menu) => {
    setSelectedMenu(menu)
    //set current price on saleItem, articleModifierGroup, modifierElement from prices where menuId === menu.id
    const tmpSaleItemCategory: SaleItemCategory[] = saleItemCategories.map((saleItemCategory) => {
      return {
        ...saleItemCategory,
        saleItems: saleItemCategory?.saleItems?.map((saleItem) => {
          return {
            ...saleItem,
            currentMenuPrice: saleItem?.prices?.find((price) => price.menuId === menu.id)?.price ?? 0,
            saleItemArticles: saleItem?.saleItemArticles?.map((saleItemArticle) => {
              return {
                ...saleItemArticle,
                article: {
                  id: saleItemArticle.article?.id ?? '',
                  name: saleItemArticle.article?.name ?? '',
                  description: saleItemArticle.article?.description ?? '',
                  needsCommand: saleItemArticle.article?.needsCommand ?? false,
                  active: saleItemArticle.article?.active ?? false,
                  articleModifiers: saleItemArticle.article?.articleModifiers?.map((articleModifier) => {
                    return {
                      id: articleModifier.id,
                      articleId: articleModifier.articleId,
                      modifierGroupId: articleModifier.modifierGroupId,
                      order: articleModifier.order,
                      minSelect: articleModifier.minSelect,
                      maxSelect: articleModifier.maxSelect,
                      priceByGroup: articleModifier.priceByGroup,
                      currentMenuPrice: articleModifier.prices?.find((price) => price.menuId === menu.id)?.price ?? 0,
                      modifierGroup: {
                        id: articleModifier.modifierGroup?.id ?? '',
                        name: articleModifier.modifierGroup?.name ?? '',
                        showLabel: articleModifier.modifierGroup?.showLabel ?? false,
                        elements: articleModifier.modifierGroup?.elements?.map((element) => {
                          return {
                            id: element.id,
                            name: element.name,
                            defaultRecipeId: element.defaultRecipeId,
                            combinable: element.combinable,
                            combinableModifierGroupId: element.combinableModifierGroupId,
                            modifierGroupId: element.modifierGroupId,
                            currentMenuPrice: element.prices?.find((price) => price.menuId === menu.id)?.price ?? 0,
                          }
                        }),
                      },
                    }
                  }),
                },
              }
            }),
          }
        }),
      }
    })
    setSaleItemCategoriesWithPrice(tmpSaleItemCategory)
    setSaleItemCategory(tmpSaleItemCategory[0])
  }




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
        {/* -------------menus--------------------- */}
        <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2'>
          {menus.map((menu, index) => (
            <div
              onClick={() => handleChangeMenu(menu)}
              key={index}
              className={clsx(
                'flex bg-red-800 text-white cursor-pointer select-none hover:bg-white hover:border-gray-900 hover:!text-black justify-between px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
                {
                  'bg-white border-gray-900 !text-black': selectedMenu?.id === menu.id,
                }
              )}
            >
              <div className={`${titleFont.className}  antialiased text-xs font-bold`}>{menu.name}</div>
            </div>
          ))}
        </div>
        {/* -------------Categorias--------------------- */}
        {saleItemCategoriesWithPrice.length > 0 && (
          <div className='w-full flex gap-2 px-2 shadow-md py-3'>
            {saleItemCategoriesWithPrice.map((saleItemCategory, index) => (
              <div
                onClick={() => setSaleItemCategory(saleItemCategory)}
                key={index}
                className='flex bg-black text-white cursor-pointer select-none hover:bg-white hover:border-gray-900 hover:!text-black justify-center px-3 py-1 border-y-2 shadow-xl rounded-md border-white'
              >
                <div className={`${titleFont.className} text-center  antialiased text-xs font-bold`}>
                  {saleItemCategory.name}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* -------------Items de venta--------------------- */}
        {saleItemCategory?.saleItems !== undefined ? (
          saleItemCategory.saleItems.length > 0 ? (
            <div className='w-full flex gap-2 px-2 py-3'>
              {saleItemCategory?.saleItems?.map((saleItem, index) => (
                <div
                  onClick={() => handleSetSaleItem(saleItem)}
                  key={index}
                  className='flex flex-wrap bg-black w-1/6 text-white cursor-pointer select-none h-20 items-center px-3 py-1 border-y-2 shadow-xl rounded-md border-white
                 hover:bg-white hover:border-gray-900 hover:!text-black'
                >
                  <div className={`${titleFont.className}  antialiased text-center w-full text-xs font-bold`}>
                    {saleItem.name}
                  </div>
                  {
                    saleItem.currentMenuPrice !== undefined && saleItem.currentMenuPrice > 0 ? (
                  
                  <div className={`${titleFont.className}  antialiased text-center w-full text-xs font-bold`}>
                    {currencyFormat(saleItem.currentMenuPrice ?? 0)}
                  </div>
                  ) : null
                  }
                </div>
              ))}
            </div>
          ) : (
            <div className='w-full flex justify-center items-center h-3/5'>
              <div className='text-3xl text-gray-500'>No hay items de venta</div>
            </div>
          )
        ) : null}
        <BillSaleItem setSaleItem={setSaleItem} saleItem={saleItem} />
      </div>
      <div className='w-2/5 shadow-2xl bg-white h-screen z-40'></div>
    </div>
  )
}
