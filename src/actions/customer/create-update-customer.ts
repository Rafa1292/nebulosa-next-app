'use server'

import { Customer } from '@/interfaces'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const customerSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  idNumber: z.string().optional(),
  creditState: z.boolean().optional(),
  creditLimit: z.number().optional()
})

export const createUpdateCustomer = async (data: Customer) => {
  try {
    const parse = customerSchema.safeParse(data)
    if (!parse.success) {
      throw new Error(parse.error.message)
    }
    const { id, ...customer } = parse.data
    let returnedCustomer: Customer | null = null
    if (id) {
      // update
      returnedCustomer = await prisma.customer.update({
        where: {
          id,
        },
        data: customer,
      })
    } else {
      // create
      const newCustomer = {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        idNumber: customer.idNumber || '',
        creditState: customer.creditState || false,
        creditLimit: customer.creditLimit || 0,

      }
      returnedCustomer = await prisma.customer.create({
        data: newCustomer,
      })
    }
    revalidatePath(`/admin/customers`)

    return {
      ok: true,
      message: 'Cliente creado',
      customer: returnedCustomer
    }
  } catch (error: any) {
    console.log(error.message)
    return {
      ok: false,
      message: error.message,
    }
  }
}
