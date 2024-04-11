
import { PayMethod } from "./pay-method.interface"


export interface Account {
  id: string
  name: string
  description?: string | null
  active: boolean
  cash: boolean
  payMethods?: PayMethod[]
}