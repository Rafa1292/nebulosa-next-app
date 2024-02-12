'use client'

import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { createUpdatePreparation } from '@/actions'
import { useRouter } from 'next/navigation'
import { Preparation } from '@/interfaces'

interface Props {
  preparation: Partial<Preparation>
}

interface FormInputs {
  id: string
  name: string
  presentation: number
  cost: number
}

export const PreparationForm = ({ preparation }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...preparation,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (preparation.id) {
      formData.append('id', preparation.id)
    }
    formData.append('name', data.name)
    formData.append('cost', data.cost.toString())
    formData.append('presentation', data.presentation.toString())

    const { ok, message } = await createUpdatePreparation(formData)
    if (ok) {
      router.push('/admin/preparations')
    } else {
      alert(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid  grid-cols-1 w-full px-8 md:px-48'>
      <div className='mt-5'>
        <div className='flex flex-col mb-4'>
          <span className='font-bold text-sm antialiased'>Nombre</span>
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
          <span className='font-bold text-sm antialiased'>Costo</span>
          <input
            {...register('cost', { required: 'El costo es obligatorio' })}
            type='text'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='cost'
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
          <span className='font-bold text-sm antialiased'>Presentacion</span>
          <input
            {...register('presentation', {
              required: 'La presentacion es obligatoria'
            })}
            type='text'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='presentation'
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
