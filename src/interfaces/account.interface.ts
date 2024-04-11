
import { PayMethod } from "./pay-method.interface"


export interface Account {
  id: string
  name: string
  description?: string
  active: boolean
  cash: boolean
  payMethods?: PayMethod[]
}