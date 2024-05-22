import { createUpdateTables, getTables } from '@/actions'
import { RoomTable } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RoomTableState = {
  tables: RoomTable[]
  createTables: (tables: RoomTable[]) => void
  getTables: () => Promise<RoomTable[]>
}

export const useRoomTableStore = create<RoomTableState>()(
  persist(
    (set, get) => ({
      tables: [],
      createTables: async (tables: RoomTable[]) => {
        const { ok } = await createUpdateTables(tables)
        if (ok) {
          const { ok: okGet, tables } = await getTables()
          if (okGet) {
            set({ tables })
          } else {
            alert('Error al obtener las mesas')
          }
        } else {
          alert('Error al crear las mesas')
        }
      },
      getTables: async () => {
        const { ok, tables } = await getTables()
        if (ok && tables) {
          set({ tables })
          return tables
        } else {
          alert('Error al obtener las mesas')
          return []
        }
      }
    }),
    {
      name: 'room-table-store',
    }
  )
)
