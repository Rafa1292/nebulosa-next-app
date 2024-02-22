import { BillItemLinkedArticle } from "."

export interface BillItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  tax: number
  billId: string
  saleItemId: string
  kitchenMessage: boolean
  itemArticles: BillItemLinkedArticle[]
}
