'use client'

import { Account, Brand } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import { createUpdateAccount, createUpdateBrand } from '@/actions'
import clsx from 'clsx'

interface Props {
  account: Partial<Account>
}

interface FormInputs {
  id: string
  name: string  
  description?: string
  active: boolean
  cash: boolean
}

export const AccountForm = ({ account }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...account,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (account.id) {
      formData.append('id', account.id)
    }
    formData.append('name', data.name)
    formData.append('description', data.description || '')
    formData.append('active', data.active.toString())
    formData.append('cash', data.cash.toString())


    const { ok, message } = await createUpdateAccount(formData)
    if (ok) {
      router.push('/admin/accounts')
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
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased text-sm'>Descripción</span>
          <textarea
            {...register('description')}
            className='p-2 border rounded-md bg-gray-100'
          />
        </div>

        <div className='flex items-center mb-4'>
          <input
            id='active'
            type='checkbox'
            {...register('active')}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label
            htmlFor='active'
            className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
          >
            Activa
          </label>
        </div>

        <div className='flex items-center mb-4'>
          <input
            id='cash'
            type='checkbox'
            {...register('cash')}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label
            htmlFor='cash'
            className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
          >
            Efectivo
          </label>
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
