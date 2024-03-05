'use client'

import { deleteElementPrice } from '@/actions'
import { Title } from '@/components'
import { ElementPrice, Menu, ModifierElement, ModifierGroup, Recipe } from '@/interfaces'
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
  modifierGroups: ModifierGroup[]
  modifierGroupId?: string
  menus: Menu[]
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

export const ModifierElementForm = (
  {
  addModifierElement,
  modifierGroupId,
  modifierElement,
  recipes,
  setModifierElement,
  modifierGroups,
  showForm,
  setShowForm,
  menus
}: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...modifierElement,
    },
  })
  const [currentModifierElement, setCurrentModifierElement] = useState<ModifierElement | null>(modifierElement)
  const [btnText, setBtnText] = useState('Agregar')

  watch('combinable')

  const onSubmit = async (data: FormInputs) => {
    let validPrices = true

    if (currentModifierElement?.prices) {
      currentModifierElement?.prices.forEach((price: ElementPrice) => {
        if (price.price < 1) {
          validPrices = false
          alert('Debes asignar un precio a todos los menus seleccionados')
        } 
      })
    }

    if (!validPrices) {
      return
    }


    if (getValues('combinable')) {
      if (!data.combinableModifierGroupId) {
        alert('Debe seleccionar un grupo combinable')
        return
      }
      data.combinableModifierGroupId = ''
    }
    const dataTmp = { ...data, prices: currentModifierElement?.prices ?? [], modifierGroupId: modifierGroupId ?? '' }
    const ok = await addModifierElement(dataTmp)
    if (ok) {
      setBtnText('Agregar')
      setCurrentModifierElement(null)
      reset()
    }
  }

  const cancel = () => {
    reset()
    setModifierElement(null)
    setShowForm(false)
  }

  const includeMenu = async (menuId: string, elementPriceId?: string) => {
    if (currentModifierElement?.prices?.some((x) => x.menuId === menuId)) {
      //if itemPriceComes, delete from db
      if (elementPriceId) {
        const { ok } = await deleteElementPrice(elementPriceId)
        if (!ok) {
          alert('Error al eliminar el precio')
          return
        }
      }
      
      setCurrentModifierElement({
        ...currentModifierElement,
        prices: currentModifierElement.prices?.filter((x) => x.menuId !== menuId),
      })
    } else {
      setCurrentModifierElement({
        ...currentModifierElement!,
        prices: [
          ...(currentModifierElement?.prices ?? []),
          {
            id: '',
            menuId,
            price: 0,
            modifierElementId: currentModifierElement?.id ?? '',
          },
        ],
      })
    }
  }

  const setMenuPrice = (menuId: string, price: number) => {

    setCurrentModifierElement({
      ...currentModifierElement!,
      prices: currentModifierElement?.prices?.map((x) => (x.menuId === menuId ? { ...x, price } : x)),
    })
  }

  const inputMustBeChecked = (menuId: string): boolean | undefined => {
    const state = currentModifierElement?.prices?.some((x) => x.menuId === menuId)
    if (state) {
      return true
    }

    return false
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
    setCurrentModifierElement(modifierElement)
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
                    <select {...register('defaultRecipeId')} className='p-2 border rounded-md bg-gray-100'>
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
              <div className='flex items-center mb-4 pl-2'>
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
              {getValues('combinable') && (
                <div className='flex flex-col mb-4'>
                  <span className='font-bold text-sm antialiased'>Grupo combinable</span>
                  <div className='grid grid-cols-1 gap-4'>
                    <div className='flex flex-col'>
                      <select {...register('combinableModifierGroupId')} className='p-2 border rounded-md bg-gray-100'>
                        <option value=''>[Seleccione]</option>
                        {modifierGroups.map((modifierGroup) => (
                          <option key={modifierGroup.id} value={modifierGroup.id}>
                            {modifierGroup.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <span className='font-bold text-sm antialiased'>Precios</span>
              {/* menus aqui */}
              {menus.map((menu) => (
                <div key={menu.id} className='flex items-center mt-3 pl-2'>
                  <input
                    checked={inputMustBeChecked(menu.id)}
                    onChange={() => includeMenu(menu.id, currentModifierElement?.prices?.find((x) => x.menuId === menu.id)?.id)}
                    id={menu.id}
                    type='checkbox'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label
                    htmlFor={menu.id}
                    className='ms-2 py-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
                  >
                    {menu.name}
                  </label>
                  {currentModifierElement?.prices?.some((x) => x.menuId === menu.id) && (
                    <div className='flex flex-wrap'>
                      <input
                        value={currentModifierElement?.prices?.find((x) => x.menuId === menu.id)?.price}
                        onChange={(e) => setMenuPrice(menu.id, Number(e.target.value))}
                        placeholder='Precio'
                        type='number'
                        className='px-2 py-1 text-sm border rounded-md bg-gray-100'
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className='flex gap-3 flex-wrap justify-center w-full'>
                <button
                  type='submit'
                  className={clsx('text-white font-bold w-1/3 rounded bg-green-600 hover:bg-green-500 py-2 cursor-pointer', {
                  
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
