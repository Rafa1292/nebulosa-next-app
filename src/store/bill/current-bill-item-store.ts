import {
  BillItem,
  BillItemLinkedArticle,
  LinkedArticle,
  LinkedArticleModifier,
  LinkedArticleModifierElement,
  ModifierElement,
  SaleItem,
} from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  billItem: BillItem | null
  addBillItem: (saleItem: SaleItem, itemNumber: number) => void
  setQuantity: (quantity: number) => void
  addLinkedArticleModifierElement: (
    saleItemArticleId: string,
    articleId: string,
    modifierElement: LinkedArticleModifierElement,
    modifierGroupId: string,
    itemNumber: number
  ) => void
  getLinkedArticleModifierElement: (
    saleItemArticleId: string,
    articleId: string,
    modifierGroupId: string, 
    itemNumber: number
  ) => LinkedArticleModifierElement[]
  addBillItemArticle: (saleItem: SaleItem, itemNumber: number) => void
}

export const useBillItemStore = create<State>()(
  persist(
    (set, get) => ({
      billItem: null,
      addBillItemArticle: (saleItem: SaleItem, itemNumber: number) => {
        const billItemLinkedArticles: BillItemLinkedArticle[] =
          saleItem.saleItemArticles?.map((saleItemArticle) => {
            const linkedArticleModifiers: LinkedArticleModifier[] =
              saleItemArticle.article?.articleModifiers?.map((articleModifier) => {
                return {
                  id: '',
                  linkedArticleId: '',
                  maxSelectable: articleModifier.maxSelect ?? 0,
                  minSelectable: articleModifier.minSelect ?? 0,
                  modifierGroupId: articleModifier.modifierGroupId,
                  showLabel: articleModifier.modifierGroup?.showLabel ?? false,
                  articleModifierId: articleModifier.id,
                  billItemLinkedArticleId: '',
                  quantity: 1,
                  name: articleModifier.modifierGroup?.name ?? '',
                  price: 0,
                }
              }) ?? []
            const linkedArticles: LinkedArticle[] = [
              {
                id: '',
                articleId: saleItemArticle.articleId,
                unitPrice: 0,
                billArticleId: '',
                isComanded: false,
                name: saleItemArticle.article?.name ?? '',
                modifiers: linkedArticleModifiers,
              },
            ]
            const billItemLinkedArticle: BillItemLinkedArticle = {
              id: '',
              billItemId: '',
              combined: false,
              description: '',
              itemNumber: itemNumber,
              saleItemArticleId: saleItemArticle.id,
              linkedArticles,
            }
            return billItemLinkedArticle
          }) ?? []
        const billItem = get().billItem!
        if (billItem.itemArticles === undefined) {
          billItem.itemArticles = [...billItemLinkedArticles]
        } else {
          billItem.itemArticles = [...billItem.itemArticles!, ...billItemLinkedArticles]
        }
        set({ billItem })
      },
      addBillItem: (saleItem: SaleItem, itemNumber: number) => {
        const billItem: BillItem = {
          id: '',
          description: saleItem.name,
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          tax: 0,
          billId: '',
          saleItemId: saleItem.id,
          kitchenMessage: false,
        }
        const billItemLinkedArticles: BillItemLinkedArticle[] =
          saleItem.saleItemArticles?.map((saleItemArticle) => {
            const linkedArticleModifiers: LinkedArticleModifier[] =
              saleItemArticle.article?.articleModifiers?.map((articleModifier) => {
                return {
                  id: '',
                  linkedArticleId: '',
                  maxSelectable: articleModifier.maxSelect ?? 0,
                  minSelectable: articleModifier.minSelect ?? 0,
                  modifierGroupId: articleModifier.modifierGroupId,
                  showLabel: articleModifier.modifierGroup?.showLabel ?? false,
                  articleModifierId: articleModifier.id,
                  billItemLinkedArticleId: '',
                  quantity: 1,
                  name: articleModifier.modifierGroup?.name ?? '',
                  price: 0,
                }
              }) ?? []
            const linkedArticles: LinkedArticle[] = [
              {
                id: '',
                articleId: saleItemArticle.articleId,
                unitPrice: 0,
                billArticleId: '',
                isComanded: false,
                name: saleItemArticle.article?.name ?? '',
                modifiers: linkedArticleModifiers,
              },
            ]
            const billItemLinkedArticle: BillItemLinkedArticle = {
              id: '',
              billItemId: '',
              combined: false,
              description: '',
              itemNumber,
              saleItemArticleId: saleItemArticle.id,
              linkedArticles,
            }
            return billItemLinkedArticle
          }) ?? []
        if (billItem.itemArticles === undefined) {
          billItem.itemArticles = [...billItemLinkedArticles]
        } else {
          billItem.itemArticles = [...billItem.itemArticles!, ...billItemLinkedArticles]
        }
        set({ billItem })
      },
      setQuantity: (quantity: number) => set((state) => ({ billItem: { ...state.billItem!, quantity } })),
      addLinkedArticleModifierElement: (
        saleItemArticleId: string,
        articleId: string,
        linkedArticleModifierElement: LinkedArticleModifierElement,
        modifierGroupId: string,
        itemNumber: number
      ) =>
        set((state) => {
          console.log(itemNumber)
          const itemArticles: BillItemLinkedArticle[] =
            state.billItem!.itemArticles?.map((itemArticle) => {
              if (itemArticle.saleItemArticleId !== saleItemArticleId) return itemArticle
              if(itemArticle.itemNumber !== itemNumber) return itemArticle
              const linkedArticles: LinkedArticle[] =
                itemArticle.linkedArticles?.map((linkedArticle) => {
                  if (linkedArticle.articleId !== articleId) return linkedArticle
                  const modifiers: LinkedArticleModifier[] =
                    linkedArticle.modifiers?.map((modifier) => {
                      if (modifier.modifierGroupId !== modifierGroupId) return modifier
                      let modifierElements: LinkedArticleModifierElement[] = modifier.elements ?? []
                      const modifierElement = modifierElements.find(
                        (element) => element.modifierElementId === linkedArticleModifierElement.modifierElementId
                      )
                      if (modifierElement) {
                        if (linkedArticleModifierElement.quantity === 0) {
                          modifierElements = modifierElements.filter(
                            (element) => element.modifierElementId !== linkedArticleModifierElement.modifierElementId
                          )
                        } else {
                          modifierElement.quantity = linkedArticleModifierElement.quantity
                        }
                      } else {
                        if (modifier.maxSelectable === 1) {
                          modifierElements = [linkedArticleModifierElement]
                        } else {
                          modifierElements.push(linkedArticleModifierElement)
                        }
                      }
                      return {
                        ...modifier,
                        elements: modifierElements,
                      }
                    }) ?? []
                  return {
                    ...linkedArticle,
                    modifiers,
                  }
                }) ?? []
              return {
                ...itemArticle,
                linkedArticles,
              }
            }) ?? []
          return { billItem: { ...state.billItem!, itemArticles } }
        }),
      getLinkedArticleModifierElement: (saleItemArticleId: string, articleId: string, modifierGroupId: string, itemNumber: number) => {
        const billItemTmp = get().billItem
        console.log(billItemTmp)
        if (billItemTmp) {
          const itemArticle = billItemTmp.itemArticles?.find(
            (itemArticle) => itemArticle.saleItemArticleId === saleItemArticleId && itemArticle.itemNumber === itemNumber
          )
          if (itemArticle) {
            const linkedArticle = itemArticle.linkedArticles?.find(
              (linkedArticle) => linkedArticle.articleId === articleId
            )
            if (linkedArticle) {
              const modifier = linkedArticle.modifiers?.find((modifier) => modifier.modifierGroupId === modifierGroupId)
              if (modifier) {
                return modifier.elements ?? []
              }
            }
          }
          return []
        }
        return []
      },
    }),

    {
      name: 'current-bill-item-store',
    }
  )
)
