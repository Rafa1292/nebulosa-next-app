'use client'

import { Title } from '@/components'
import { ElementPrice, ModifierElement, Recipe } from '@/interfaces'
import { ErrorMessage } from '@hookform/error-message'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoCloseCircleOutline } from 'react-icons/io5'

interface Props {
  recipes: Recipe[]
  addModifierElement: (modifierElement: ModifierElement) => Promise<boolean>
  setShowForm: (show: boolean) => void
  showForm: boolean
  setModifierElement: (modifierElement: ModifierElement | null) => void
  modifierElement: ModifierElement | null
  //   articles: Article[]
  modifierGroupId?: string
}

interface FormInputs {
  id: string
  name: string
  defaultRecipeId: string
  combinable: boolean
  combinableModifierGroupId: string
  modifierGroupId: string
  prices?: ElementPrice[]
}

export const ModifierElementForm = ({
  addModifierElement,
  modifierGroupId,
  modifierElement,
  recipes,
  setModifierElement,
  //   articles,
  showForm,
  setShowForm,
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
      ...modifierElement,
    },
  })
  const [btnText, setBtnText] = useState('Agregar')

  const onSubmit = async (data: FormInputs) => {
    const ok = await addModifierElement({ ...data, modifierGroupId: modifierGroupId ?? '' })
    if (ok) {
      setBtnText('Agregar')
      reset()
    }

  }

  const cancel = () => {
    reset()
    setModifierElement(null)
    setShowForm(false)
  }

  useEffect(() => {
    if (modifierElement !== null) {
      if (modifierElement.id) {
        setBtnText('Actualizar')
        setValue('id', modifierElement.id)
      }
      setValue('name', modifierElement.name)
      setValue('defaultRecipeId', modifierElement.defaultRecipeId)
      setValue('combinable', modifierElement.combinable)
      setValue('combinableModifierGroupId', modifierElement.combinableModifierGroupId)
      setValue('modifierGroupId', modifierElement.modifierGroupId)
      setValue('prices', modifierElement.prices)
    }
  }, [modifierElement])

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
        {modifierGroupId === undefined || modifierGroupId == '' ? (
          <div className='flex flex-col items-center justify-center w-full'>
            <p className='text-red-800 font-bold text-center'>Debe agregar el grupo para acceder a los elementos</p>
          </div>
        ) : (
          <>
            <Title className='w-full text-center my-10' title='Articulos disponibles' />
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 w-full'>
              <div className='flex flex-col mb-4'>
                <span className='font-bold text-sm antialiased'>Recetas</span>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='flex flex-col'>
                    <select
                      {...register('defaultRecipeId')}
                      className='p-2 border rounded-md bg-gray-100'
                    >
                      <option value=''>[Seleccione]</option>
                      {recipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
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
              <div className='flex items-center mt-3 pl-2'>
                <input
                  {...register('combinable')}
                  id='combinable'
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='combinable'
                  className='ms-2 py-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
                >
                  Combinable
                </label>
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
          </>
        )}
      </div>
    </>
  )
}
