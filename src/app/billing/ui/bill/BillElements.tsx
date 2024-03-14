'use client'

import { QuantitySelector } from '@/components'
import { titleFont } from '@/config/fonts'
import { ArticleModifierGroup, LinkedArticleModifierElement, ModifierElement, ModifierGroup } from '@/interfaces'
import clsx from 'clsx'
import { useState } from 'react'

interface Props {
  articleModifierGroup: ArticleModifierGroup | undefined
}

export const BillElements = ({ articleModifierGroup }: Props) => {
  const [linkedArticleModifierElements, setLinkedArticleModifierElements] = useState<LinkedArticleModifierElement[]>([])

  const addLinkedArticleModifierElementByQuantity = (quantity: number, modifierElement: ModifierElement) => {
    const currentOptionsSelected = linkedArticleModifierElements.reduce((acc, linkedArticleModifierElement) => {
      if (articleModifierGroup?.modifierGroup?.elements?.some((element) => element.id === linkedArticleModifierElement.modifierElementId && element.id !== modifierElement.id)) {
        return acc + linkedArticleModifierElement.quantity
      }
      return acc
    }, 0)
    if(currentOptionsSelected + quantity > articleModifierGroup!.maxSelect) {
      alert('No puedes seleccionar más elementos')
      return
    }
    const linkedArticleModifierElement = linkedArticleModifierElements.find(
      (linkedArticleModifierElement) => linkedArticleModifierElement.modifierElementId === modifierElement.id
    )
    if (linkedArticleModifierElement) {
      setLinkedArticleModifierElements(
        linkedArticleModifierElements.map((linkedArticleModifierElement) => {
          if (linkedArticleModifierElement.modifierElementId === modifierElement.id) {
            return {
              ...linkedArticleModifierElement,
              quantity: quantity,
            }
          }
          return linkedArticleModifierElement
        })
      )
    } else {
      setLinkedArticleModifierElements([
        ...linkedArticleModifierElements,
        {
          id: '',
          linkedArticleModifierId: '',
          modifierElementId: modifierElement.id,
          name: modifierElement.name,
          price: 0,
          quantity,
        },
      ])
    }
  }

  const addLinkedArticleModifierElement = (modifierElement: ModifierElement) => {
    const elementIds = articleModifierGroup?.modifierGroup?.elements?.map((element) => element.id)
    const newLinkedArticleModifierElement: LinkedArticleModifierElement = {
      id: '',
      linkedArticleModifierId: '',
      modifierElementId: modifierElement.id,
      name: modifierElement.name,
      price: 0,
      quantity: 1,
    }
    const filterLinkedArticleModifierElements: LinkedArticleModifierElement[] = linkedArticleModifierElements
    .filter((linkedArticleModifierElement) => !elementIds?.includes(linkedArticleModifierElement.modifierElementId))
    setLinkedArticleModifierElements(
      [...filterLinkedArticleModifierElements, newLinkedArticleModifierElement]
    )

  }

  return (
    <div className='w-full flex flex-wrap gap-3 px-2 justify-center py-4'>
      <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>Elementos</div>
      {articleModifierGroup?.modifierGroup?.elements?.map((element, index) => (
        <div
          onClick={ articleModifierGroup.maxSelect > 1 ?  () => {} : () => addLinkedArticleModifierElement( element) }
          key={index}
          className={clsx(
            'flex bg-black text-white flex-wrap cursor-pointer h-20 w-1/5 items-center select-none justify-center px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
            ' hover:bg-white hover:border-gray-900 hover:!text-black',
            {
              '!border-y-2 !bg-white !text-black !border-gray-900': linkedArticleModifierElements.some(
                (linkedArticleModifierElement) => linkedArticleModifierElement.modifierElementId === element.id
              )
            }
          )}
        >
          <div className={`${titleFont.className} w-full px antialiased text-center text-xs font-bold`}>
            {element.name}
          </div>
          {articleModifierGroup.maxSelect > 1 && (
            <QuantitySelector
              minusClassName='hover:bg-black p-0.5 hover:!text-white rounded-2xl'
              plusClassName='hover:bg-black p-0.5 hover:!text-white rounded-2xl'
              quantity={linkedArticleModifierElements.find(
                (linkedArticleModifierElement) => linkedArticleModifierElement.modifierElementId === element.id
              )?.quantity || 0}
              setQuantity={(quantity: number) => addLinkedArticleModifierElementByQuantity(quantity, element)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
