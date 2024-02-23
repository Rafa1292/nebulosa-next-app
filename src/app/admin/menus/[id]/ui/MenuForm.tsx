'use client'

import { Menu } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import { createUpdateMenu } from '@/actions'
import clsx from 'clsx'

interface Props {
  menu: Partial<Menu>
}

interface FormInputs {
  id: string
  name: string
  commissionPercentage: number
}

export const MenuForm = ({  menu }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...menu,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (menu.id) {
      formData.append('id', menu.id)
    }
    formData.append('name', data.name)
    formData.append('commissionPercentage', data.commissionPercentage.toString())

    const { ok, message } = await createUpdateMenu(formData)
    if (ok) {
      router.push('/admin/menus')
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
          <span className='font-bold text-sm antialiased'>% de comision</span>
          <input {...register('commissionPercentage')} type='number' className='p-2 border rounded-md bg-gray-100' />
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
