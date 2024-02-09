'use client'

import { Input, Route, measures } from '@/interfaces'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { createUpdateProvider } from '@/actions'
import { useRouter } from 'next/navigation'

interface Props {
  input: Partial<Input>
}


interface FormInputs {
    id: string;
    name: string;
    lowerPrice: number;
    upperPrice: number;
    currentPrice: number;
    lastPrice: number;
    expectedPrice: number;
    stock: number;
    presentation: number;
    suggestedStock: number;
    currentProviderId: string;
    inputCategoryId: string;
    measureSlug: string;
}

export const InputForm = ({ input }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    getValues,
    setValue,
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...input
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (input.id) {
      formData.append('id', input.id)
    }
    formData.append('name', data.name)


    const { ok, message} = await createUpdateProvider(formData)
    if (ok) {
      router.push('/admin/providers')
    } else {
      alert(message)
    }
  }



  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid  grid-cols-1 w-full px-8 md:px-48'>
      <div className='mt-5'>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased'>Nombre</span>
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
          <span className='font-bold antialiased'>Precio</span>
          <input
            {...register('expectedPrice')}
            type='number'
            className='p-2 border rounded-md bg-gray-100'
          />
        </div>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased'>Stock</span>
          <input
            {...register('stock')}
            type='number'
            className='p-2 border rounded-md bg-gray-100'
          />
        </div>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased'>Presentación</span>
          <input
            {...register('presentation')}
            type='number'
            className='p-2 border rounded-md bg-gray-100'
          />
        </div>

        <button type='submit' disabled={!isValid} className='w-full p-2 bg-blue-500 text-white rounded-md'>
          Guardar
        </button>
      </div>
    </form>
  )
}
