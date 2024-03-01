'use client'

import { ModifierGroup } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import {  createUpdateModifierGroup } from '@/actions'
import clsx from 'clsx'

interface Props {
  modifierGroup: Partial<ModifierGroup>
}

interface FormInputs {
  id: string
  name: string
  showLabel: boolean
}

export const ModifierGroupForm = ({ modifierGroup }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...modifierGroup,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (modifierGroup.id) {
      formData.append('id', modifierGroup.id)
    }
    formData.append('name', data.name)
    formData.append('showLabel', data.showLabel.toString())

    const { ok, message } = await createUpdateModifierGroup(formData)
    if (ok) {
      router.push('/admin/modifier-groups')
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

        <div className='flex items-center mb-4'>
          <input
            {...register('showLabel')}
            id='showLabel'
            type='checkbox'
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
                    <label
            htmlFor='showLabel'
            className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
          >
            Mostrar etiqueta
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
