import { Bill, BillItem, DeliveryMethod } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  bill: Bill
  setMenuId: (menuId: string) => void
  addItemToBill: (billItem: BillItem) => boolean
  initBill: () => void
  removeBillItem: (saleItemId: string) => void
  getItemArticleTotal: (itemNumber: number, saleItemId: string) => number
  getBillItemTotal: (saleItemId: string) => number
  setAddressId: (addressId: string) => void
  setDeliveryMethod: (deliveryMethod: DeliveryMethod) => void
  setCustomerId: (customerId: string) => void
}

const initialBill: Bill = {
  addressId: '',
  items: [],
  clientId: '',
  closed: false,
  closeWorkDayId: '',
  commandTime: new Date(),
  deliveryMethod: 'Mesa',
  id: '',
  isCredit: false,
  isNull: false,
  isServed: false,
  menuId: '',
  openWorkDayId: '',
  tableNumber: 0,
}

const getCurrentItemArticleTotal = (bill: Bill, itemNumber: number, saleItemId: string) => {
  const item = bill.items?.find((item) => item.saleItemId === saleItemId)
  const itemArticle = item?.itemArticles?.find((itemArticle) => itemArticle.itemNumber === itemNumber)
  let total = item?.unitPrice ?? 0
  if (itemArticle) {
    itemArticle.linkedArticles?.forEach((linkedArticle) => {
      linkedArticle.modifiers?.forEach((modifier) => {
        total +=
          modifier.elements?.reduce((acc, element) => {
            return acc + element.price * element.quantity
          }, 0) ?? 0
      })
    })
  }
  return total
}

export const useBillStore = create<State>()(
  persist(
    (set, get) => ({
      bill: initialBill,

      addItemToBill: (billItem: BillItem) => {
        const bill = get().bill
        const item = bill.items?.find((item) => item.saleItemId === billItem.saleItemId)
        console.log('item', item)
        if (item) {          
          const currentItems = bill.items?.filter((item) => item.saleItemId !== billItem.saleItemId)
          billItem.itemArticles?.forEach((itemArticle) => {
            const itemNumber = item?.itemArticles?.length ?? 0
            item?.itemArticles?.push({ ...itemArticle, itemNumber: itemNumber + 1 })
          })
          set({ bill: { ...bill, items: [...(currentItems ?? []), item] } })
          return true
        } else {
          set({ bill: { ...bill, items: [...(bill.items ?? []), billItem] } })
          return true
        }
      },
      initBill: () => {
        set({ bill: initialBill })
      },
      removeBillItem: (saleItemId: string) => {
        const bill = get().bill
        const items = bill.items?.filter((item) => item.saleItemId !== saleItemId)
        set({ bill: { ...bill, items } })
      },
      getItemArticleTotal: (itemNumber: number, saleItemId: string) => {
        const bill = get().bill
        return getCurrentItemArticleTotal(bill, itemNumber, saleItemId)
      },
      getBillItemTotal: (saleItemId: string) => {
        const bill = get().bill
        const item = bill.items?.find((item) => item.saleItemId === saleItemId)
        let total = (item?.unitPrice ?? 0) * (item?.quantity ?? 0) ?? 0
        item?.itemArticles?.forEach((itemArticle) => {
          itemArticle.linkedArticles?.forEach((linkedArticle) => {
            linkedArticle.modifiers?.forEach((modifier) => {
              total +=
                modifier.elements?.reduce((acc, element) => {
                  return acc + element.price * element.quantity
                }, 0) ?? 0
            })
          })
        })
        return total
      },
      setMenuId: (menuId: string) => {
        const bill = get().bill
        set({ bill: { ...bill, menuId } })
      },
      setAddressId: (addressId: string) => {
        const bill = get().bill
        set({ bill: { ...bill, addressId } })
      },
      setDeliveryMethod: (deliveryMethod: DeliveryMethod) => {
        const bill = get().bill
        set({ bill: { ...bill, deliveryMethod } })
      },
      setCustomerId: (customerId: string) => {
        const bill = get().bill
        set({ bill: { ...bill, clientId: customerId } })
      }
    }),
    {
      name: 'bill-store',
    }
  )
)
