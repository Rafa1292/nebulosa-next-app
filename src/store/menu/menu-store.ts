import { Menu, SaleItemCategory } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type MenuState = {
  menus: Menu[]
  saleItemCategories: SaleItemCategory[]
  saleItemCategoriesWithPrice: SaleItemCategory[]
  setMenus: (menus: Menu[]) => void
  setSaleItemCategories: (saleItemCategories: SaleItemCategory[]) => void
  setSaleItemCategoriesWithPriceFromMenu: (menu: Menu) => SaleItemCategory[]
}

const getSaleItemCategoriesWithPrice = (menu: Menu, saleItemCategories: SaleItemCategory[]) => {
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
  return tmpSaleItemCategories
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      menus: [],
      saleItemCategories: [],
        saleItemCategoriesWithPrice: [],
      setMenus: (menus: Menu[]) => {
        set({ menus })
      },
      setSaleItemCategories: (saleItemCategories: SaleItemCategory[]) => {
        set({ saleItemCategories })
      },
      setSaleItemCategoriesWithPriceFromMenu: (menu: Menu) => {
        if (get().saleItemCategories.length === 0) {
          return []
        }
        const saleItemCategoriesWithPrice = getSaleItemCategoriesWithPrice(menu, get().saleItemCategories)
        set({ saleItemCategoriesWithPrice })
        return saleItemCategoriesWithPrice
      }
    }),
    {
      name: 'menu-store',
    }
  )
)
