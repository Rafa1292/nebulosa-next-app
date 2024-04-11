'use client'

import { Account, Brand, PayMethod } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import { createUpdateBrand, createUpdatePayMethod } from '@/actions'
import clsx from 'clsx'

interface Props {
  payMethod: Partial<PayMethod>
  accounts: Account[]
}

interface FormInputs {
  id: string
  name: string
  accountId: string
  active: boolean
  commission: number
  isPublic: boolean
  isSemiPublic: boolean
}

export const PayMethodForm = ({ payMethod, accounts }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...payMethod,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (payMethod.id) {
      formData.append('id', payMethod.id)
    }
    formData.append('name', data.name)
    formData.append('accountId', data.accountId)
    formData.append('active', data.active.toString())
    formData.append('commission', data.commission.toString())
    formData.append('isPublic', data.isPublic.toString())
    formData.append('isSemiPublic', data.isSemiPublic.toString())

    const { ok, message } = await createUpdatePayMethod(formData)
    if (ok) {
      router.push('/admin/pay-methods')
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
          <span className='font-bold text-sm antialiased'>Cuenta</span>
          <select {...register('accountId', { required: true })} className='p-2 border rounded-md bg-gray-100'>
            <option value=''>[Seleccione]</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased text-sm'>Comisión</span>
          <input {...register('commission')} type='number' className='p-2 border rounded-md bg-gray-100' />
        </div>
        <div className='flex items-center mb-4'>
          <input
            id='active'
            type='checkbox'
            {...register('active')}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label htmlFor='active' className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'>
            Activo
          </label>
        </div>
        <div className='flex items-center mb-4'>
          <input
            id='isPublic'
            type='checkbox'
            {...register('isPublic')}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label htmlFor='isPublic' className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'>
            Público
          </label>
        </div>
        <div className='flex items-center mb-4'>
          <input
            id='isSemiPublic'
            type='checkbox'
            {...register('isSemiPublic')}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label
            htmlFor='isSemiPublic'
            className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
          >
            Semipúblico
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
