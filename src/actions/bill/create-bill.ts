'use server'

import { Bill } from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const linkedArticleModifierelementSchema = z.object({
  modifierElementId: z.string().uuid(),
  linkedArticleModifierId: z.string(),
  price: z.number(),
  quantity: z.number(),
  name: z.string(),
})

const linkedArticleModifierSchema = z.object({
  quantity: z.number(),
  maxSelect: z.number(),
  minSelect: z.number(),
  showLabel: z.boolean(),
  name: z.string(),
  modifierGroupId: z.string().uuid(),
  elements: z.array(linkedArticleModifierelementSchema),
})

const linkedArticleSchema = z.object({
  name: z.string(),
  unitPrice: z.number(),
  isCommanded: z.boolean(),
  articleId: z.string().uuid(),
  billArticleId: z.string(),
  modifiers: z.array(linkedArticleModifierSchema),
})

const billItemLinkedArticleSchema = z.object({
  billItemId: z.string(),
  itemNumber: z.number(),
  saleItemArticleId: z.string().uuid(),
  combined: z.boolean(),
  description: z.string(),
  linkedArticles: z.array(linkedArticleSchema),
})

const billItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  discount: z.number(),
  tax: z.number(),
  billId: z.string(),
  saleItemId: z.string().uuid(),
  kitchenMessage: z.boolean(),
  itemArticles: z.array(billItemLinkedArticleSchema),
})

const billSchema = z.object({
  closed: z.boolean(),
  tableNumber: z.number(),
  deliveryMethod: z.enum(['Mesa', 'Domicilio', 'Recoger']),
  clientId: z.string().uuid(),
  addressId: z.string(),
  openWorkDayId: z.string(),
  closeWorkDayId: z.string(),
  commandTime: z.string(),
  isNull: z.boolean(),
  menuId: z.string(),
  isServed: z.boolean(),
  isCredit: z.boolean(),
  items: z.array(billItemSchema),
})

export const createBill = async (data: Bill) => {
  try {
    console.log(data)
    const parse = billSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { items, ...bill } = parse.data
    // init transaction
    await prisma.$transaction(async (tx) => {
      const billCreated = await tx.bill.create({
        data: bill,
      })
      for (const item of items) {
        const { itemArticles, ...billItem } = item
        const billItemCreated = await tx.billItem.create({
          data: {
            ...billItem,
            billId: billCreated.id,
          },
        })
        for (const itemArticle of itemArticles) {
          const { linkedArticles, ...billItemArticle } = itemArticle
          const billItemArticleCreated = await tx.billItemLinkedArticle.create({
            data: {
              ...billItemArticle,
              billItemId: billItemCreated.id,
            },
          })
          for (const linkedArticle of linkedArticles) {
            const { modifiers, ...linkedArticleData } = linkedArticle
            const linkedArticleCreated = await tx.linkedArticle.create({
              data: {
                ...linkedArticleData,
                billArticleId: billItemArticleCreated.id,
              },
            })
            for (const modifier of modifiers) {
              const { elements, ...modifierData } = modifier
              const modifierCreated = await tx.linkedArticleModifier.create({
                data: {
                  ...modifierData,
                  linkedArticleId: linkedArticleCreated.id,
                },
              })
              for (const element of elements) {
                await tx.linkedArticleModifierElement.create({
                  data: {
                    ...element,
                    linkedArticleModifierId: modifierCreated.id,
                  },
                })
              }
            }
          }
        }
      }
    })

    return {
      ok: true,
      message: 'Factura creada',
    }
  } catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}
