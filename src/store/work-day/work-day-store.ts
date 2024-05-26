
import { getWorkDayByEmail } from '@/actions'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  workDayId: string | null
  getWorkDayByEmail: (workDayId: string) => Promise<string | null>
}

export const useWorkDayStore = create<State>()(
  persist(
    (set, get) => ({
      workDayId: null,
      getWorkDayByEmail: async (email: string) => {
        const { workDay, ok } = await getWorkDayByEmail(email)
        if (ok) {
          set({ workDayId: workDay?.id })
        }
        return workDay?.id ?? null
      },
    }),
    {
      name: 'work-day-store',
    }
  )
)
