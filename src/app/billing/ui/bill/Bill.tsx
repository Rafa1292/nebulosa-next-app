'use client'

import { titleFont } from '@/config/fonts'
import { BillItem, Menu, SaleItem, SaleItemCategory } from '@/interfaces'
import clsx from 'clsx'
import { useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { useBillItemStore, useBillStore } from '@/store'
import { currencyFormat } from '@/utils'
import { BillSaleItem } from './BillSaleItem'
import { BillItemUI } from './BillItem'
import { BillClient } from './BillClient'
import { BillDeliveryMethod } from './BillDeliveryMethod'
import { BillItemHeader } from './BillItemHeader'
import { BillActions } from './BillActions'
import { BillPayMethod } from './BillPayMethod'

interface Props {
  saleItemCategories: SaleItemCategory[]
  menus: Menu[]
  show?: boolean
  setShow: (show: boolean) => void
}

export const Bill = ({ show = true, setShow, menus, saleItemCategories }: Props) => {
  const { bill, setMenuId, removeBillItem } = useBillStore()
  const { addBillItem, setBillItemForEdit } = useBillItemStore()
  const [saleItemCategory, setSaleItemCategory] = useState<SaleItemCategory | null>(null)
  const [saleItem, setSaleItem] = useState<SaleItem | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [saleItemCategoriesWithPrice, setSaleItemCategoriesWithPrice] = useState<SaleItemCategory[]>([])
  const [showPayMethod, setShowPayMethod] = useState(false)

  const handleSetSaleItem = (saleItem: SaleItem) => {
    addBillItem(saleItem, 1)
    setSaleItem(saleItem)
  }

  const handleChangeMenu = (menu: Menu) => {
    let isValid = true
    if (bill.menuId !== '') {
      if (bill.items!.length > 0) {
        if (bill.menuId !== menu.id) {
          alert('No puedes agregar items de diferentes menus en la misma cuenta')
          isValid = false
        }
      }
    }
    if (isValid) {
      setSelectedMenu(menu)
      setMenuId(menu.id)
      const tmpSaleItemCategories: SaleItemCategory[] = saleItemCategories.map((saleItemCategory) => {
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
      setSaleItemCategoriesWithPrice(tmpSaleItemCategories)
      setSaleItemCategory(tmpSaleItemCategories[0])
      return tmpSaleItemCategories
    }
  }

  const handleEditBillItem = (billItem: BillItem) => {
    const currentMenu = menus.find((menu) => menu.id === bill.menuId)
    if (currentMenu) {
      const tmpSaleItemCategories = handleChangeMenu(currentMenu) ?? []
      tmpSaleItemCategories.forEach((saleItemCategory) => {
        const item = saleItemCategory.saleItems?.find((saleItem) => saleItem.id === billItem.saleItemId)
        if (item) {
          setBillItemForEdit(billItem)
          removeBillItem(billItem.saleItemId)
          setSaleItem(item)
          return
        }
      })
    }
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
            {saleItemCategoriesWithPrice.map((tmpSaleItemCategory, index) => (
              <div
                onClick={() => setSaleItemCategory(tmpSaleItemCategory)}
                key={index}
                className={clsx(
                  'flex bg-black text-white cursor-pointer select-none hover:bg-white hover:border-gray-900 hover:!text-black justify-center px-3 py-1 border-y-2 shadow-xl rounded-md border-white',
                  {
                    'bg-white !border-gray-900 !text-black': tmpSaleItemCategory.id === saleItemCategory?.id,
                  }
                )}
              >
                <div className={`${titleFont.className} text-center  antialiased text-xs font-bold`}>
                  {tmpSaleItemCategory.name}
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
                  {saleItem.currentMenuPrice !== undefined && saleItem.currentMenuPrice > 0 ? (
                    <div className={`${titleFont.className}  antialiased text-center w-full text-xs font-bold`}>
                      {currencyFormat(saleItem.currentMenuPrice ?? 0)}
                    </div>
                  ) : null}
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
      <div className='w-2/5 shadow-2xl pb-[20vh] relative bg-white h-[100vh] pt-1 z-40'>
        {/* delivery method 10%*/}
        <BillDeliveryMethod />
        {/* client info 6%*/}
        <BillClient />
        {bill.items!.length > 0 ? (
          <>
            {/* header 5%*/}
            <BillItemHeader />
            {/* items */}
            <div className='w-full flex flex-col h-[64vh]  overflow-scroll gap-2'>
              {bill.items!.map((billItem, index) => (
                <BillItemUI
                  currentKey={index}
                  handleEditBillItem={handleEditBillItem}
                  key={index}
                  billItem={billItem}
                />
              ))}
            </div>
          </>
        ) : (
          <div className='w-full flex justify-center items-center h-3/5'>
            <div className='text-3xl text-gray-500'>No hay items en la cuenta</div>
          </div>
        )}
            {/* actions 20%*/}
        <div className='w-full absolute bottom-0 right-0 h-[15vh] bg-white '>
          <BillActions setShowPayMethod={setShowPayMethod} showPayMethod={showPayMethod} setShow={setShow}/>
        </div>
      </div>
      <BillPayMethod show={showPayMethod} />
    </div>
  )
}
