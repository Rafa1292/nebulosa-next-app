import { PayMethod } from "./pay-method.interface"

export interface AccountHistory{
    id: string
    amount: number
    previousBalance: number
    currentBalance: number
    pay: boolean
    payMethodId: string
    payMethod?: PayMethod
}