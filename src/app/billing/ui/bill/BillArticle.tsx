'use client'

import { titleFont } from '@/config/fonts'
import { ArticleModifierGroup, SaleItem, SaleItemArticle } from '@/interfaces'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { BillElements } from './BillElements'

interface Props {
  saleItem: SaleItem | null
  itemNumber: number
}

export const BillArticle = ({ saleItem, itemNumber }: Props) => {
  const [selectedArticleModifierGroup, setSelectedArticleModifierGroup] = useState<ArticleModifierGroup | undefined>(
    undefined
  )
  const [selectedItemArticle, setSelectedItemArticle] = useState<SaleItemArticle | undefined>(undefined)

  const onItemArticleChange = (itemArticle: SaleItemArticle | undefined) => {
    setSelectedItemArticle(itemArticle)
    setSelectedArticleModifierGroup(itemArticle?.article?.articleModifiers?.[0])
  }

  useEffect(() => {
    if (saleItem !== null) {
      setSelectedItemArticle(saleItem.saleItemArticles?.[0])
      setSelectedArticleModifierGroup(saleItem.saleItemArticles?.[0]?.article?.articleModifiers?.[0])
    }
  }, [itemNumber])

  return (
    <>
      <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2 flex-wrap'>
        <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>Articulos</div>

        {saleItem?.saleItemArticles?.map((itemArticle, index) => (
          <div
            onClick={() => onItemArticleChange(itemArticle)}
            key={index}
            className={clsx(
              'flex bg-black w-1/5 justify-center text-white h-16 items-center cursor-pointer select-none px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
              'hover:bg-white hover:!text-black',
              {
                'bg-white !border-gray-900 !text-black': selectedItemArticle?.articleId === itemArticle.article?.id,
              }
            )}
          >
            <div className={`${titleFont.className}  antialiased text-center text-xs font-bold`}>
              {itemArticle.article?.name}
            </div>
          </div>
        ))}
      </div>
      {selectedItemArticle !== undefined && (
        <div className='w-full flex flex-wrap gap-3 px-2 shadow-lg justify-center py-4'>
          <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>
            Modificadores
          </div>
          {selectedItemArticle?.article?.articleModifiers?.map((articleModifier, index) => (
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
        <BillElements
          itemNumber={itemNumber}
          saleItemArticleId={selectedItemArticle?.id ?? ''}
          articleModifierGroup={selectedArticleModifierGroup}
        />
      )}
    </>
  )
}
