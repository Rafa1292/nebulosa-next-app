'use client'

import { QuantitySelector } from '@/components'
import { titleFont } from '@/config/fonts'
import { ArticleModifierGroup, LinkedArticleModifierElement, ModifierElement, ModifierGroup } from '@/interfaces'
import clsx from 'clsx'
import {  useEffect, useState } from 'react'
import { useBillItemStore } from '@/store'

interface Props {
  articleModifierGroup: ArticleModifierGroup | undefined
  saleItemArticleId: string
}

export const BillElements = ({ articleModifierGroup, saleItemArticleId }: Props) => {
  const { addLinkedArticleModifierElement, getLinkedArticleModifierElement } = useBillItemStore()
  const [linkedArticleModifierElements, setLinkedArticleModifierElements] = useState<LinkedArticleModifierElement[]>([])

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
      price: 0,
      quantity,
    }
    addLinkedArticleModifierElement(
      saleItemArticleId,
      articleModifierGroup?.articleId ?? '',
      linkedArticleModifierElement,
      articleModifierGroup!.modifierGroup?.id ?? ''
    )
    const currentElements = getLinkedArticleModifierElement(saleItemArticleId, articleModifierGroup?.articleId ?? '', articleModifierGroup?.modifierGroup?.id ?? '')
    setLinkedArticleModifierElements(currentElements)
  }

  useEffect(() => {
    const currentElements = getLinkedArticleModifierElement(saleItemArticleId, articleModifierGroup?.articleId ?? '', articleModifierGroup?.modifierGroup?.id ?? '')
    setLinkedArticleModifierElements(currentElements)
  }, [articleModifierGroup, saleItemArticleId])


  return (
    <div className='w-full flex flex-wrap gap-3 px-2 justify-center py-4'>
      <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>Elementos</div>
      {articleModifierGroup?.modifierGroup?.elements?.map((element, index) => (
        <div
          onClick={articleModifierGroup.maxSelect > 1 ? () => {} : () => handleAddLinkedArticleModifierElement(1, element)}
          key={index}
          className={clsx(
            'flex bg-black text-white flex-wrap cursor-pointer h-20 w-1/5 items-center select-none justify-center px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
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
            {element.currentMenuPrice}
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
    </div>
  )
}
