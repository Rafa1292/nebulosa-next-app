'use client'

import { titleFont } from '@/config/fonts'
import { Article, ArticleModifierGroup, ModifierGroup, SaleItem } from '@/interfaces'
import clsx from 'clsx'
import { useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BillElements } from './BillElements'
import { QuantitySelector } from '@/components'

interface Props {
  saleItem: SaleItem | null
  setSaleItem: (saleItem: SaleItem | null) => void
}

export const BillArticles = ({ saleItem, setSaleItem }: Props) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | undefined>(undefined)
  const [selectedArticleModifierGroup, setSelectedArticleModifierGroup] = useState<ArticleModifierGroup | undefined>(
    undefined
  )

  const closeModal = () => {
    setSaleItem(null)
    setSelectedArticle(undefined)
    setSelectedArticleModifierGroup(undefined)
  }

  const onArticleChange = (article: Article | undefined) => {
    setSelectedArticle(article)
    setSelectedArticleModifierGroup(undefined)
  }

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
          <div className='w-1/4'>
            <QuantitySelector
              minusClassName='hover:bg-black p-0.5 hover:!text-white rounded-2xl'
              plusClassName='hover:bg-black p-0.5 hover:!text-white rounded-2xl'
              quantity={0}
              setQuantity={(quantity: number) => {}}
            />
          </div>
        </div>
        <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2 flex-wrap'>
          <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>
            Articulos
          </div>
          {saleItem?.saleItemArticles?.map((itemArticle, index) => (
            <div
              onClick={() => onArticleChange(itemArticle?.article)}
              key={index}
              className={clsx(
                'flex bg-black w-1/5 justify-center text-white h-16 items-center cursor-pointer select-none px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
                'hover:bg-white hover:!text-black',
                {
                  'bg-white !border-gray-900 !text-black': selectedArticle?.id === itemArticle.article?.id,
                }
              )}
            >
              <div className={`${titleFont.className}  antialiased text-center text-xs font-bold`}>
                {itemArticle.article?.name}
              </div>
            </div>
          ))}
        </div>
        {selectedArticle !== undefined && (
          <div className='w-full flex flex-wrap gap-3 px-2 shadow-lg justify-center py-4'>
            <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>
              Modificadores
            </div>
            {selectedArticle?.articleModifiers?.map((articleModifier, index) => (
              <div
                onClick={() => setSelectedArticleModifierGroup(articleModifier)}
                key={index}
                className={clsx(
                  'flex bg-black w-1/5 justify-center text-white h-16 items-center cursor-pointer select-none px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
                  ' hover:!bg-white hover:!text-black ',
                  {
                    ' bg-white !border-gray-900 !text-black':
                      selectedArticleModifierGroup?.modifierGroupId === articleModifier.modifierGroupId,
                  }
                )}
              >
                <div className={`${titleFont.className}  antialiased text-center text-xs font-bold`}>
                  {articleModifier.modifierGroup?.name}
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedArticleModifierGroup !== undefined && (
          <BillElements articleModifierGroup={selectedArticleModifierGroup} />
        )}
      </div>
    </div>
  )
}
