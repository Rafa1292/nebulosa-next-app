import { createBill } from '@/actions/bill/create-bill'
import { getBillByTableNumber } from '@/actions/bill/get-bill-by-table-number'
import { AccountHistory, Bill, BillItem, DeliveryMethod } from '@/interfaces'
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
  saveBill: () => Promise<boolean>
  getTotalBill: () => number
  getTotalHistories: () => number
  getBillDiscount: () => number
  addDiscount: (discount: number) => void
  addBillAccountHistory: (tmpAccountHistory?: AccountHistory, index?: number) => void
  removeBillAccountHistory: (index: number) => void 
  getBillFromServer: (billId: string, tableNumber: number) => void
  needsCommand: () => boolean
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

const getCurrentBillItemTotal = (bill: Bill, saleItemId: string) => {
  const item = bill.items?.find((item) => item.saleItemId === saleItemId)
  let total = 0
  item?.itemArticles?.forEach((itemArticle) => {
    total += getCurrentItemArticleTotal(bill, itemArticle.itemNumber, saleItemId)
  })
  return total
}


export const useBillStore = create<State>()(
  persist(
    (set, get) => ({
      bill: initialBill,
      getBillFromServer: async (billId: string, tableNumber: number) => {
        const { bill } = await getBillByTableNumber(tableNumber)
        if(bill) {
          set({ bill })
          return
        } else {
          set({ bill: initialBill })
        }

      },
      needsCommand: () => {
        const bill = get().bill
        if(bill.id === '') return true
        if(bill.items?.length === 0) return true
        for (const item of bill.items?? []) {
          let isCommanded = true
          for (const itemArticle of item.itemArticles ?? []) {
           for (const linkedArticle of itemArticle.linkedArticles ?? []) {
            if(!linkedArticle.isCommanded) {
              isCommanded = false
              break
            }            
           }
            if(!isCommanded) break
          }
          if(!isCommanded) return true
        }
        return false
      },
      addItemToBill: (billItem: BillItem) => {
        const bill = get().bill
        const item = bill.items?.find((item) => item.saleItemId === billItem.saleItemId)
        if (item) {
          const currentItems = bill.items?.filter((item) => item.saleItemId !== billItem.saleItemId)
          billItem.itemArticles?.forEach((itemArticle) => {
            const itemNumber = item?.itemArticles?.length ?? 0
            item?.itemArticles?.push({ ...itemArticle, itemNumber: itemNumber + 1 })
          })
          set({
            bill: {
              ...bill,
              items: [
                ...(currentItems ?? []),
                {
                  ...item,
                  quantity: item.itemArticles?.reduce((max, curr) => {
                    if (curr.itemNumber > max.itemNumber) return curr

                    return max
                  }).itemNumber ?? 0,
                },
              ],
            },
          })
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
        return getCurrentBillItemTotal(bill, saleItemId)
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
      },
      saveBill: async () => {
        const { ok, message } = await createBill(get().bill)
        if(!ok)
          {
            alert(message)
          }
        return ok ?? false
      },
      getTotalBill: () => {
        const bill = get().bill
        let total = 0
        bill.items?.forEach((item) => {
          total += getCurrentBillItemTotal(bill, item.saleItemId)
        })
        return total
      },
      getTotalHistories: () => {
        const bill = get().bill
        let total = 0
        bill.histories?.forEach((history) => {
          total += history.accountHistory?.amount ?? 0
        })
        return total
      },
      addDiscount: (discountAmount: number) => {
        //set discount amount for each item
        const bill = get().bill
        const discountPerItem = discountAmount / (bill.items?.length ?? 0)
        const items = bill.items?.map((item) => {
          const itemTotal = get().getBillItemTotal(item.saleItemId)
          const discountItem = discountPerItem
          return { ...item, discount: discountItem }
        })
        set({ bill: { ...bill, items } })
      },
      getBillDiscount: () => {
        const bill = get().bill
        let total = 0
        bill.items?.forEach((item) => {
          total += item.discount ?? 0
        })
        return total
      },
      addBillAccountHistory: (tmpAccountHistory?: AccountHistory, index?:number) => {
        if (tmpAccountHistory) {
          if(index !== undefined) {
            const tmpAccountHistories = get().bill.histories?.filter((_, i) => i !== index)
            set({ bill: { ...get().bill, histories: [...(tmpAccountHistories ?? []), {id:'', billId:'', accountHistoryId:'', accountHistory: tmpAccountHistory}] } })
            return
          }
          set({ bill: { ...get().bill, histories: [...(get().bill.histories ?? []), {id:'', billId:'', accountHistoryId:'', accountHistory: tmpAccountHistory}] } })
          return
        }
      },
      removeBillAccountHistory: (index: number) => {
        const bill = get().bill
        const histories = bill.histories?.filter((_, i) => i !== index)
        set({ bill: { ...bill, histories } })
      }
    }),
    {
      name: 'bill-store',
    }
  )
)
