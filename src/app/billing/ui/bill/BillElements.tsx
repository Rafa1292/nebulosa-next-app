'use client'

import { QuantitySelector } from '@/components'
import { titleFont } from '@/config/fonts'
import { ArticleModifierGroup, LinkedArticleModifierElement, ModifierElement } from '@/interfaces'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useBillItemStore } from '@/store'
import { useBillStore } from '@/store'
import { currencyFormat } from '@/utils'

interface Props {
  articleModifierGroup: ArticleModifierGroup | undefined
  saleItemArticleId: string
  itemNumber: number
  closeModal: () => void
}

export const BillElements = ({ articleModifierGroup, closeModal, saleItemArticleId, itemNumber }: Props) => {
  const { addItemToBill } = useBillStore()
  const { addLinkedArticleModifierElement, getLinkedArticleModifierElement, validateBillItem, billItem, initBillItem } =
    useBillItemStore()
  const [linkedArticleModifierElements, setLinkedArticleModifierElements] = useState<LinkedArticleModifierElement[]>([])
  const [isValid, setIsValid] = useState<boolean>(false)

  const handleAddLinkedArticleModifierElement = (quantity: number, modifierElement: ModifierElement) => {
    const currentOptionsSelected = linkedArticleModifierElements.reduce((acc, linkedArticleModifierElement) => {
      if (
        articleModifierGroup?.modifierGroup?.elements?.some(
          (element) =>
            element.id === linkedArticleModifierElement.modifierElementId && element.id !== modifierElement.id
        )
      ) {
        return acc + linkedArticleModifierElement.quantity
      }
      return acc
    }, 0)

    if (currentOptionsSelected + quantity > articleModifierGroup!.maxSelect && articleModifierGroup!.maxSelect > 1) {
      alert('No puedes seleccionar más elementos')
      return
    }
    const linkedArticleModifierElement = {
      id: '',
      linkedArticleModifierId: '',
      modifierElementId: modifierElement.id,
      name: modifierElement.name,
      price: modifierElement.currentMenuPrice ?? 0,
      quantity,
    }
    addLinkedArticleModifierElement(
      saleItemArticleId,
      articleModifierGroup?.articleId ?? '',
      linkedArticleModifierElement,
      articleModifierGroup!.modifierGroup?.id ?? '',
      itemNumber,
      articleModifierGroup
    )
    const currentElements = getLinkedArticleModifierElement(
      saleItemArticleId,
      articleModifierGroup?.articleId ?? '',
      articleModifierGroup?.modifierGroup?.id ?? '',
      itemNumber
    )
    setLinkedArticleModifierElements(currentElements)
    setIsValid(validateBillItem())
  }

  useEffect(() => {
    const isValid = validateBillItem()
    setIsValid(isValid)
    const currentElements = getLinkedArticleModifierElement(
      saleItemArticleId,
      articleModifierGroup?.articleId ?? '',
      articleModifierGroup?.modifierGroup?.id ?? '',
      itemNumber
    )
    setLinkedArticleModifierElements(currentElements)
  }, [articleModifierGroup, saleItemArticleId, itemNumber])

  return (
    <div className='w-full flex flex-wrap gap-3 px-2 justify-center pt-4 pb-20'>
      <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2 select-none`}>
        Elementos
      </div>
      {articleModifierGroup?.modifierGroup?.elements?.map((element, index) => (
        <div
          onClick={
            articleModifierGroup.maxSelect > 1 ? () => {} : () => handleAddLinkedArticleModifierElement(1, element)
          }
          key={index}
          className={clsx(
            'flex bg-black text-white flex-wrap cursor-pointer h-24 w-1/5 items-center select-none justify-center px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
            ' hover:bg-white hover:border-gray-900 hover:!text-black',
            {
              '!border-y-2 !bg-white !text-black !border-gray-900': linkedArticleModifierElements.some(
                (linkedArticleModifierElement) => linkedArticleModifierElement.modifierElementId === element.id
              ),
            }
          )}
        >
          <div className={`${titleFont.className} w-full px antialiased text-center text-xs font-bold`}>
            {element.name}
          </div>
          <div className={`${titleFont.className} w-full px antialiased text-center text-xs font-bold`}>
            {currencyFormat(element.currentMenuPrice ?? 0)}
          </div>
          {articleModifierGroup.maxSelect > 1 && (
            <QuantitySelector
              minusClassName='hover:bg-black p-0.5 hover:!text-white rounded-2xl'
              plusClassName='hover:bg-black p-0.5 hover:!text-white rounded-2xl'
              quantity={
                linkedArticleModifierElements.find(
                  (linkedArticleModifierElement) => linkedArticleModifierElement.modifierElementId === element.id
                )?.quantity || 0
              }
              setQuantity={(quantity: number) => handleAddLinkedArticleModifierElement(quantity, element)}
            />
          )}
        </div>
      ))}
      <div className='w-full fixed bottom-0 bg-white'>
        <button
          className={clsx('w-full left-0 bg-green-800 text-white text-center text-2xl font-bold py-2', {
            '!bg-gray-400': !isValid,
          })}
          onClick={() => {
            if (isValid) {
              const state = addItemToBill(billItem!)
              if(state){
                initBillItem()
                closeModal()
              }
            }
          }}
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
