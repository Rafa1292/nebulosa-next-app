'use client'

import { Title } from '@/components'
import { Preparation, RecipePreparation, measures } from '@/interfaces'
import { ErrorMessage } from '@hookform/error-message'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoCloseCircleOutline } from 'react-icons/io5'

interface Props {
  addRecipePreparation: (recipePreparation: RecipePreparation) => void
  setShowForm: (show: boolean) => void
  showForm: boolean
  recipePreparation: RecipePreparation | null
  preparations: Preparation[]
  recipeId?: string
}

interface FormInputs {
  id: string
  preparationId: string
  recipeId: string
  measureSlug: string
  quantity: number
}

export const RecipePreparationForm = ({
  addRecipePreparation,
  recipeId,
  recipePreparation,
  preparations: preparations,
  showForm,
  setShowForm,
//   setPreparationInput
}: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    setValue,
    reset,
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...recipePreparation,
    },
  })
  const [btnText, setBtnText] = useState('Agregar')
  const onSubmit = (data: FormInputs) => {
    addRecipePreparation({ ...data, recipeId: recipeId ?? ''})
    setBtnText('Agregar')
    reset()
  }

  const cancel = () => {
    reset()
    // setPreparationInput(null)
    setShowForm(false)
  }

  useEffect(() => {
    if (recipePreparation !== null) {
      if (recipePreparation.id) {
        setBtnText('Actualizar')
        setValue('id', recipePreparation.id)
      }
      setValue('preparationId', recipePreparation.preparationId)
      setValue('quantity', recipePreparation.quantity)
      setValue('measureSlug', recipePreparation.measureSlug)
    }
  }, [recipePreparation])

  return (
    <>
      <div
        className={clsx(
          'w-full transition-all z-50 h-fit right-0 py-14 px-4 md:w-2/5 mt-16 flex absolute justify-center flex-wrap rounded shadow-2xl bg-gray-100',
          {
            'translate-x-full': !showForm,
          }
        )}
      >
        <IoCloseCircleOutline
          onClick={() => setShowForm(false)}
          className=' cursor-pointer text-4xl absolute text-red-800 left-3 top-3 hover:text-red-700'
        />
        <Title className='w-full text-center my-10' title='Preparaciones disponibles' />
          <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 w-full'>
            <div className='flex flex-col mb-4'>
              <span className='font-bold text-sm antialiased'>Insumos</span>
              <div className='grid grid-cols-1 gap-4'>
                <div className='flex flex-col'>
                  <select
                  disabled={recipePreparation?.id !== undefined}
                    {...register('preparationId', { required: 'La preparacion es obligatoria' })}
                    className='p-2 border rounded-md bg-gray-100'
                  >
                    <option value=''>[Seleccione]</option>
                    {preparations.map((preparation) => (
                      <option key={preparation.id} value={preparation.id}>
                        {preparation.name}
                      </option>
                    ))}
                    {
                      recipePreparation !== null ? (
                        <option key={recipePreparation.preparationId} value={recipePreparation.preparationId}>
                          {recipePreparation.preparation?.name}
                        </option>
                      ) : null
                    }
                  </select>
                  <ErrorMessage
                    errors={errors}
                    name='preparationId'
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
              </div>
            </div>
            <div className='flex flex-col mb-4'>
              <span className='font-bold text-sm antialiased'>Cantidad</span>
              <input
                {...register('quantity', { required: 'La cantidad es obligatoria', min: 1 })}
                type='number'
                className='p-2 border rounded-md bg-gray-100'
              />
              <ErrorMessage
                errors={errors}
                name='quantity'
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
              <span className='font-bold text-sm antialiased'>Medidas</span>
              <div className='grid grid-cols-1 gap-4'>
                <div className='flex flex-col'>
                  <select
                    {...register('measureSlug', { required: 'La medida es obligatoria' })}
                    className='p-2 border rounded-md bg-gray-100'
                  >
                    <option value=''>[Seleccione]</option>
                    {measures.map((measure) => (
                      <option key={measure.slug} value={measure.slug}>
                        {measure.name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage
                    errors={errors}
                    name='measureSlug'
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
              </div>
            </div>
            <div className='flex gap-3 flex-wrap justify-center w-full'>
              <button
                type='submit'
                disabled={!isValid}
                className={clsx('text-white font-bold w-1/3 rounded', {
                  'bg-green-600 hover:bg-green-500 py-2 cursor-pointer': isValid,
                  'bg-gray-400 py-2 cursor-not-allowed': !isValid,
                })}
              >
                {btnText}
              </button>
              <button
                type='button'
                onClick={() => cancel()}
                className='text-white font-bold w-2/5 rounded bg-red-800 hover:bg-red-700 py-2 cursor-pointer'
              >
                Cancelar
              </button>
            </div>
          </form>
      </div>
    </>
  )
}
