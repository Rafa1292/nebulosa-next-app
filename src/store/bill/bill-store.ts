import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
}

export const useBillStore = create<State>()(
  persist(
    (set, get) => ({

      


    }),
    {
      name: 'bill-store',
    }
  )
)
