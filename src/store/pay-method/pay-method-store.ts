import { getPayMethods } from '@/actions'
import { PayMethod } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type PayMethodState = {
    payMethods: PayMethod[]
    setPayMethods: () => Promise<PayMethod[]>
    getPayMethodsFromStore: () => Promise<PayMethod[]>
}

const getPayMethodsFromServer = async () => {
    const {payMethods} = await getPayMethods()
    return payMethods
}

export const usePayMethodStore = create<PayMethodState>()(
    persist(
      (set, get) => ({
        payMethods: [],
        setPayMethods: async () => {
          const payMethods = await getPayMethodsFromServer()
          set({ payMethods })
          return payMethods ?? []
        },
        getPayMethodsFromStore: async () => {
            if(get().payMethods.length === 0) {
                return await get().setPayMethods()
            }
            return get().payMethods
        },
      }),
      {
        name: 'pay-method-store',
      }
    )
  )
  