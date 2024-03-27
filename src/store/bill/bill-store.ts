import { Bill, BillItem } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  bill: Bill
  addItemToBill: (billItem: BillItem) => boolean
  initBill: () => void
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
  tableNumber: 0            
}


export const useBillStore = create<State>()(
  persist(
    (set, get) => ({
      bill: initialBill,

      addItemToBill: (billItem: BillItem) => {
        const bill = get().bill
        set({ bill: { ...bill, items: [...bill.items ?? [], billItem] } })
        return true
      },
      initBill: () => {
        set({ bill: initialBill })
      }
    }),
    {
      name: 'bill-store',
    }
  )
)
