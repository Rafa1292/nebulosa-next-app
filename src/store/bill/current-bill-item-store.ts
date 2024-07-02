import {
  ArticleModifierGroup,
  BillItem,
  BillItemLinkedArticle,
  LinkedArticle,
  LinkedArticleModifier,
  LinkedArticleModifierElement,
  ModifierGroup,
  SaleItem,
} from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  billItem: BillItem | null
  addBillItem: (saleItem: SaleItem, itemNumber: number) => void
  removeBillItemArticle: (itemNumber: number) => void
  addLinkedArticleModifierElement: (
    saleItemArticleId: string,
    articleId: string,
    modifierElement: LinkedArticleModifierElement,
    modifierGroupId: string,
    itemNumber: number,
    modifierGroup?: ArticleModifierGroup
  ) => void
  getLinkedArticleModifierElement: (
    saleItemArticleId: string,
    articleId: string,
    modifierGroupId: string,
    itemNumber: number
  ) => LinkedArticleModifierElement[]
  addBillItemArticle: (saleItem: SaleItem, itemNumber: number) => void
  validateBillItem: () => boolean
  setBillItemForEdit: (billItem: BillItem) => void
  initBillItem: () => void
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
                  maxSelect: articleModifier.maxSelect ?? 0,
                  minSelect: articleModifier.minSelect ?? 0,
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
                isCommanded: false,
                name: saleItemArticle.article?.name ?? '',
                modifiers: linkedArticleModifiers,
                needsCommand: true,
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
        const currentQuantity = billItem?.quantity ?? 1
        set({ billItem: { ...billItem, quantity: currentQuantity + 1 } })
      },
      addBillItem: (saleItem: SaleItem, itemNumber: number) => {
        console.log(saleItem)
        const billItem: BillItem = {
          id: '',
          description: saleItem.name,
          quantity: itemNumber,
          unitPrice: saleItem.currentMenuPrice ?? 0,
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
                  maxSelect: articleModifier.maxSelect ?? 0,
                  minSelect: articleModifier.minSelect ?? 0,
                  modifierGroupId: articleModifier.modifierGroupId,
                  showLabel: articleModifier.modifierGroup?.showLabel ?? false,
                  articleModifierId: articleModifier.id,
                  billItemLinkedArticleId: '',
                  quantity: 1,
                  name: articleModifier.modifierGroup?.name ?? '',
                  price: articleModifier.currentMenuPrice ?? 0,
                }
              }) ?? []
            const linkedArticles: LinkedArticle[] = [
              {
                id: '',
                articleId: saleItemArticle.articleId,
                unitPrice: 0,
                billArticleId: '',
                isCommanded: false,
                name: saleItemArticle.article?.name ?? '',
                modifiers: linkedArticleModifiers,
                needsCommand: true,
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
        console.log(billItem)
        set({ billItem })
      },
      addLinkedArticleModifierElement: (
        saleItemArticleId: string,
        articleId: string,
        linkedArticleModifierElement: LinkedArticleModifierElement,
        modifierGroupId: string,
        itemNumber: number,
        articleModifierGroup?: ArticleModifierGroup
      ) =>
        set((state) => {
          console.log(saleItemArticleId)
          console.log(articleId)
          console.log(linkedArticleModifierElement)
          console.log(modifierGroupId)
          console.log(itemNumber)
          const itemArticles: BillItemLinkedArticle[] =
            state.billItem!.itemArticles?.map((itemArticle) => {
              if (itemArticle.saleItemArticleId !== saleItemArticleId) return itemArticle
              if (itemArticle.itemNumber !== itemNumber) return itemArticle
              console.log(itemArticle)
              const linkedArticles: LinkedArticle[] =
                itemArticle.linkedArticles?.map((linkedArticle) => {
                  if (linkedArticle.articleId !== articleId) return linkedArticle
                  if(!linkedArticle.modifiers?.some(x => x.modifierGroupId === modifierGroupId))
                    {
                      linkedArticle.modifiers?.push({
                        id: '',
                        linkedArticleId: '',
                        maxSelect: articleModifierGroup?.maxSelect ?? 0,
                        minSelect: articleModifierGroup?.minSelect ?? 0,
                        modifierGroupId: modifierGroupId,
                        showLabel: articleModifierGroup?.modifierGroup?.showLabel ?? false,
                        quantity: 1,
                        name: articleModifierGroup?.modifierGroup?.name ?? '',
                      }
                      )
                    }
                  console.log('aqui tambien')
                  const modifiers: LinkedArticleModifier[] =
                    linkedArticle.modifiers?.map((modifier) => {
                      console.log(modifier.modifierGroupId)
                      console.log(modifier.name)
                      console.log(modifierGroupId)
                      if (modifier.modifierGroupId !== modifierGroupId) return modifier

                      console.log('aqui tambien')
                      let modifierElements: LinkedArticleModifierElement[] = modifier.elements ?? []
                      const modifierElement = modifierElements.find(
                        (element) => element.modifierElementId === linkedArticleModifierElement.modifierElementId
                      )
                      if (modifierElement) {
                        console.log('actualizando cantidad')
                        if (linkedArticleModifierElement.quantity === 0) {
                          modifierElements = modifierElements.filter(
                            (element) => element.modifierElementId !== linkedArticleModifierElement.modifierElementId
                          )
                        } else {
                          modifierElement.quantity = linkedArticleModifierElement.quantity
                        }
                      } else {
                        console.log('subiendo cantidad')
                        if (modifier.maxSelect === 1) {
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
      getLinkedArticleModifierElement: (
        saleItemArticleId: string,
        articleId: string,
        modifierGroupId: string,
        itemNumber: number
      ) => {
        const billItemTmp = get().billItem
        if (billItemTmp) {
          const itemArticle = billItemTmp.itemArticles?.find(
            (itemArticle) =>
              itemArticle.saleItemArticleId === saleItemArticleId && itemArticle.itemNumber === itemNumber
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
      removeBillItemArticle: (itemNumber: number) =>
        set((state) => {
          const billItem = state.billItem
          console.log(billItem?.quantity)
          if ((billItem?.quantity ?? 1) > 1) {
            let itemArticles = state.billItem?.itemArticles?.filter(
              (itemArticle) => itemArticle.itemNumber !== itemNumber
            )
            itemArticles =
              itemArticles?.map((itemArticle, index) => {
                if (itemArticle.itemNumber > itemNumber) {
                  itemArticle.itemNumber--
                  return itemArticle
                }
                return itemArticle
              }) ?? []
            return { billItem: { ...state.billItem!, itemArticles } }
          }
          return { billItem }
      }),
      validateBillItem: () => {
        const billItem = get().billItem
        let isValid = true
        billItem?.itemArticles?.forEach((itemArticle) => {
          itemArticle.linkedArticles?.forEach((linkedArticle) => {
            linkedArticle.modifiers?.forEach((modifier) => {
              const selectedElements = modifier.elements?.reduce((acc, element) => acc + element.quantity, 0) ?? 0
              if (selectedElements < modifier.minSelect) {
                isValid = false
                return
              }
              if (selectedElements > modifier.maxSelect) {
                isValid = false
              }
            })
          })
        })
        return isValid
      },
      setBillItemForEdit: (billItem: BillItem) => {
          //set field isCommanded on linkedArticle to false
          const itemArticles = billItem.itemArticles?.map((itemArticle) => {
            const linkedArticles = itemArticle.linkedArticles?.map((linkedArticle) => {
              linkedArticle.isCommanded = false
              return linkedArticle
            })
            return { ...itemArticle, linkedArticles }
          })
          set({ billItem: { ...billItem, itemArticles } })
      },
      initBillItem: () => {
        set({ billItem: null })
      },
    }),

    {
      name: 'current-bill-item-store',
    }
  )
)
