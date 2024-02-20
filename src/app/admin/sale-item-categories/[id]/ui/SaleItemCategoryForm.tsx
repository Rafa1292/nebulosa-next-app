'use client'

import { SaleItemCategory } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import { createUpdateSaleItemCategory } from '@/actions'
import clsx from 'clsx'

interface Props {
    saleItemCategory: Partial<SaleItemCategory>
}

interface FormInputs {
  id: string
  name: string
}

export const SaleItemCategoryForm = ({ saleItemCategory }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...saleItemCategory,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (saleItemCategory.id) {
      formData.append('id', saleItemCategory.id)
    }
    formData.append('name', data.name)

    const { ok, message } = await createUpdateSaleItemCategory(formData)
    if (ok) {
      router.push('/admin/sale-item-categories')
    } else {
      alert(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid  grid-cols-1 w-full px-8 md:px-48'>
      <div className='mt-5'>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased text-sm'>Nombre</span>
          <input
            {...register('name', { required: 'El nombre es obligatorio' })}
            type='text'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='name'
            render={({ messages }) =>
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p className='text-red-900 text-sm font-bold' key={type}>
                  {message}
                </p>
              ))
            }
          />
        </div>

        <button
          type='submit'
          disabled={!isValid}
          className={clsx('text-white font-bold py-2 px-4  rounded', {
            'bg-blue-600 hover:bg-blue-500 cursor-pointer': isValid,
            'btn-secondary cursor-not-allowed': !isValid,
          })}
        >
          Guardar
        </button>
      </div>
    </form>
  )
}
