import { Bill } from "@/interfaces"

export const getCurrentItemArticleTotal = (bill: Bill, itemNumber: number, saleItemId: string) => {
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
  
  export const getCurrentBillItemTotal = (bill: Bill, saleItemId: string) => {
    const item = bill.items?.find((item) => item.saleItemId === saleItemId)
    let total = 0
    item?.itemArticles?.forEach((itemArticle) => {
      total += getCurrentItemArticleTotal(bill, itemArticle.itemNumber, saleItemId)
    })
    console.log(total)
    return total
  }
  
  export const getTotalBill = (bill: Bill) => {
    console.log(bill.items)
    let total = 0
    bill.items?.forEach((item) => {
      total += getCurrentBillItemTotal(bill, item.saleItemId) - (item.discount ?? 0)
    })
    return total
}

export const getBillDiscount = (bill: Bill) => {
  let total = 0
  bill.items?.forEach((item) => {
    total += item.discount ?? 0
  })
  return total
}