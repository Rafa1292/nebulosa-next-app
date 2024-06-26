'use server'

import {
  Bill,
  BillItem,
  BillItemLinkedArticle,
  DeliveryMethod,
  LinkedArticle,
  LinkedArticleModifier,
  LinkedArticleModifierElement,
} from '@/interfaces'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const linkedArticleModifierelementSchema = z.object({
  id: z.string().optional().default(''),
  modifierElementId: z.string().uuid(),
  linkedArticleModifierId: z.string(),
  price: z.number(),
  quantity: z.number(),
  name: z.string(),
})

const linkedArticleModifierSchema = z.object({
  id: z.string().optional().default(''),
  linkedArticleId: z.string().optional().default(''),
  quantity: z.number(),
  maxSelect: z.number(),
  minSelect: z.number(),
  showLabel: z.boolean(),
  name: z.string(),
  modifierGroupId: z.string().uuid(),
  elements: z.array(linkedArticleModifierelementSchema).optional().default([]),
})

const linkedArticleSchema = z.object({
  id: z.string().optional().default(''),
  name: z.string(),
  unitPrice: z.number(),
  isCommanded: z.boolean(),
  articleId: z.string().uuid(),
  billArticleId: z.string(),
  modifiers: z.array(linkedArticleModifierSchema),
})

const billItemLinkedArticleSchema = z.object({
  id: z.string().optional().default(''),
  billItemId: z.string(),
  itemNumber: z.number(),
  saleItemArticleId: z.string().uuid(),
  combined: z.boolean(),
  description: z.string(),
  linkedArticles: z.array(linkedArticleSchema),
})

const billItemSchema = z.object({
  id: z.string().optional().default(''),
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
  id: z.string().optional().default(''),
  closed: z.boolean(),
  tableNumber: z.number(),
  deliveryMethod: z.enum(['Mesa', 'Domicilio', 'Recoger']),
  clientId: z.string().uuid(),
  addressId: z.string(),
  openWorkDayId: z.string(),
  closeWorkDayId: z.string(),
  commandTime: z.date().optional().default(new Date()),
  isNull: z.boolean(),
  menuId: z.string(),
  isServed: z.boolean(),
  isCredit: z.boolean(),
  items: z.array(billItemSchema),
})

export const setAddresId = async (billId: string, addressId: string) => {
  try {
    await prisma.bill.update({
      where: {
        id: billId,
      },
      data: {
        addressId: addressId,
      },
    })
    return {
      ok: true,
      message: 'Dirección actualizada',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}

export const setDeliveryMethod = async (billId: string, deliveryMethod: DeliveryMethod) => {
  try {
    await prisma.bill.update({
      where: {
        id: billId,
      },
      data: {
        deliveryMethod: deliveryMethod,
      },
    })
    return {
      ok: true,
      message: 'Método de entrega actualizado',
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    }
  }
}

export const createBill = async (data: Bill) => {
  try {
    const parse = billSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }

    const { items, id, ...bill } = parse.data
    let needsReprint = false
    // init transaction
    // increase transaction timeout
    await prisma.$transaction(
      async (tx) => {
        let billId = ''
        if (id === '') {
          const billCreated = await tx.bill.create({
            data: bill,
          })
          billId = billCreated.id
        } else {
          await tx.bill.update({
            where: {
              id: id,
            },
            data: bill,
          })
          billId = id ?? ''
        }
        needsReprint = await createUpdateItem(items, billId, tx)
      },
      { timeout: 1000000 }
    )

    return {
      ok: true,
      needsReprint,
      message: 'Factura creada',
    }
  } catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      needsReprint: false,
      message: error.message,
    }
  }
}

const createUpdateItem = async (items: Partial<BillItem>[], billId: string, tx: any): Promise<boolean> => {
  let needsReprint = false
  for (const item of items) {
    const { itemArticles, id, ...itemData } = item
    let itemId = ''
    if (item.id === '') {
      const itemCreated = await tx.billItem.create({
        data: {
          ...itemData,
          billId: billId,
        },
      })
      itemId = itemCreated.id
    } else {
      await tx.billItem.update({
        where: {
          id: item.id,
        },
        data: itemData,
      })
      itemId = item.id ?? ''
    }

    if (itemArticles) {
      const tmpRePrint = await createUpdateItemArticle(itemArticles, itemId, tx)
      if (tmpRePrint) needsReprint = true
    }
  }
  return needsReprint
}

const createUpdateItemArticle = async (
  itemArticles: Partial<BillItemLinkedArticle>[],
  billItemId: string,
  tx: any
): Promise<boolean> => {
  let needsReprint = false
  for (const itemArticle of itemArticles) {
    const { linkedArticles, id, ...itemArticleData } = itemArticle
    let itemArticleId = ''
    if (itemArticle.id === '') {
      const itemArticleCreated = await tx.billItemLinkedArticle.create({
        data: {
          ...itemArticleData,
          billItemId: billItemId,
        },
      })
      itemArticleId = itemArticleCreated.id ?? ''
    } else {
      await tx.billItemLinkedArticle.update({
        where: {
          id: itemArticle.id,
        },
        data: itemArticleData,
      })
      itemArticleId = itemArticle.id ?? ''
    }
    if (linkedArticles) {
      const tmpRePrint = await createUpdateLinkedArticle(linkedArticles, itemArticleId, tx)
      if (tmpRePrint) needsReprint = true
    }
  }
  return needsReprint
}

const createUpdateLinkedArticle = async (
  linkedArticles: Partial<LinkedArticle>[],
  billItemArticleId: string,
  tx: any
): Promise<boolean> => {
  let needsReprint = false

  for (const linkedArticle of linkedArticles) {
    const { modifiers, id, ...linkedArticleData } = linkedArticle
    let linkedArticleId = ''

    // create linked article
    if (linkedArticle.id === '') {
      const linkedArticleCreated = await tx.linkedArticle.create({
        data: {
          ...linkedArticleData,
          isCommanded: true,
          billArticleId: billItemArticleId,
        },
      })
      linkedArticleId = linkedArticleCreated.id
    }
    // update linked article
    else {
      await tx.linkedArticle.update({
        where: {
          id: linkedArticle.id,
        },
        data: {
          ...linkedArticleData,
          isCommanded: true,
        },
      })
      linkedArticleId = linkedArticle.id ?? ''
    }
    if (modifiers) {
      const tmpRePrint = await createUpdateLinkedArticleModifier(modifiers, linkedArticleId, tx)
      if (tmpRePrint) needsReprint = true
    }
  }
  return needsReprint
}

const createUpdateLinkedArticleModifier = async (
  linkedArticleModifiers: Partial<LinkedArticleModifier>[],
  linkedArticleId: string,
  tx: any
): Promise<boolean> => {
  let needsReprint = false
  for (const linkedArticleModifier of linkedArticleModifiers) {
    const { elements, id, ...modifierData } = linkedArticleModifier
    let modifierId = id ?? ''

    if (elements?.length === 0 && id !== undefined) {
      // remove linked article modifier and elements
      tx.linkedArticleModifierElement.deleteMany({
        where: {
          linkedArticleModifierId: id,
        },
      })
      tx.linkedArticleModifier.delete({
        where: {
          id,
        },
      })
      needsReprint = true
    } else {
      if (id === '') {
        const modifierCreated = await tx.linkedArticleModifier.create({
          data: {
            ...modifierData,
            linkedArticleId: linkedArticleId,
          },
        })
        modifierId = modifierCreated.id
      } else {
        await tx.linkedArticleModifier.update({
          where: {
            id: linkedArticleModifier.id,
          },
          data: modifierData,
        })
        modifierId = linkedArticleModifier.id ?? ''
      }
    }

    if (elements) {
      const tmpRePrint = await createUpdateLinkedArticleModifierElement(elements, modifierId, tx)
      if (tmpRePrint) needsReprint = true
    }
  }
  return needsReprint
}

const createUpdateLinkedArticleModifierElement = async (
  linkedArticleModifierElements: Partial<LinkedArticleModifierElement>[],
  modifierId: string,
  tx: any
): Promise<boolean> => {
  let needsReprint = false
  const currentElements: LinkedArticleModifierElement[] = await tx.linkedArticleModifierElement.findMany({
    where: {
      linkedArticleModifierId: modifierId,
    },
  })
  currentElements.map((element) => {
    const tmpElement = linkedArticleModifierElements.find((e) => e.id === element.id)
    if (!tmpElement) {
      needsReprint = true
      removeLinkedArticleModifierElement(element.id, tx)
    }
  })

  for (const element of linkedArticleModifierElements) {
    const { id, ...elementData } = element
    if (id === '') {
      await tx.linkedArticleModifierElement.create({
        data: {
          ...elementData,
          linkedArticleModifierId: modifierId,
        },
      })
    } else {
      needsReprint = true
      await tx.linkedArticleModifierElement.update({
        where: {
          id: element.id,
        },
        data: element,
      })
    }
  }

  return needsReprint
}

const removeLinkedArticleModifier = async (linkedArticleModifierId: string, tx: any) => {
  const linkedArticleModifierElements = await tx.linkedArticleModifierElement.findMany({
    where: {
      linkedArticleModifierId: linkedArticleModifierId,
    },
  })
  for (const element of linkedArticleModifierElements) {
    await removeLinkedArticleModifierElement(element.id, tx)
  }
  await tx.linkedArticleModifier.delete({
    where: {
      id: linkedArticleModifierId,
    },
  })
}

const removeLinkedArticleModifierElement = async (linkedArticleModifierElementId: string, tx: any) => {
  await tx.linkedArticleModifierElement.delete({
    where: {
      id: linkedArticleModifierElementId,
    },
  })
}
