'use client'

import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import { createWorkDay } from '@/actions'

interface Props {
    userId: string
}

interface FormInputs {
  initialCash: number
}

export const WorkDay = ({userId}:Props) => {
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<FormInputs>({
    criteriaMode: 'all'
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()
    formData.append('initialCash', data.initialCash.toString())
    formData.append('userId', userId)

    const { ok, message } = await createWorkDay(formData)
    if (ok) {
        window.location.replace('/billing')
    } else {
      alert(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid  grid-cols-1 w-full px-48'>
      <div className='mt-5'>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased text-sm'>Monto inicial</span>
          <input
            {...register('initialCash')}
            type='text'
            className='p-2 border rounded-md bg-gray-100'
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
          Enviar
        </button>
      </div>
    </form>
  )
}
