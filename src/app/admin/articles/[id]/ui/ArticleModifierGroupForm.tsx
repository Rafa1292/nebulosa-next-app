'use client'

import { deleteArticleModifierPrice } from '@/actions'
import { Title } from '@/components'
import { ArticleModifierGroup, ArticleModifierPrice, Menu, ModifierGroup } from '@/interfaces'
import { ErrorMessage } from '@hookform/error-message'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { object } from 'zod'

interface Props {
  addArticleModifierGroup: (articleModifierGroup: ArticleModifierGroup) => Promise<boolean>
  setShowForm: (show: boolean) => void
  showForm: boolean
  setArticleModifierGroup: (articleModifierGroup: ArticleModifierGroup | null) => void
  articleModifierGroup: ArticleModifierGroup | null
  modifierGroups: ModifierGroup[]
  articleId?: string
  menus: Menu[]
}

interface FormInputs {
  id: string
  articleId: string
  modifierGroupId: string
  order: number
  minSelect: number
  maxSelect: number
  priceByGroup: boolean
  prices?: ArticleModifierPrice[]
}

export const ArticleModifierGroupForm = ({
  addArticleModifierGroup,
  articleId,
  articleModifierGroup,
  setArticleModifierGroup,
  modifierGroups,
  showForm,
  setShowForm,
  menus,
}: Props) => {
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...articleModifierGroup,
    },
  })
  watch('priceByGroup')
  const [btnText, setBtnText] = useState('Agregar')
  const [currentArticleModifierGroup, setCurrentArticleModifierGroup] = useState<ArticleModifierGroup | null>(
    articleModifierGroup
  )
  const onSubmit = async (data: FormInputs) => {
    const state = await addArticleModifierGroup({ ...data, prices: currentArticleModifierGroup?.prices, articleId: articleId ?? '' })
    if (state) {
      reset()
      setArticleModifierGroup(null)
      setBtnText('Agregar')
    }
  }

  const cancel = () => {
    reset()
    setCurrentArticleModifierGroup(null)
    setArticleModifierGroup(null)
    setShowForm(false)
  }

  const inputMustBeChecked = (menuId: string): boolean | undefined => {
    const state = currentArticleModifierGroup?.prices?.some((x) => x.menuId === menuId)
    if (state) {
      return true
    }

    return false
  }

  const includeMenu = async (menuId: string, articleModifierPriceId?: string) => {
    if (currentArticleModifierGroup?.prices?.some((x) => x.menuId === menuId)) {
      //if itemPriceComes, delete from db
      if (articleModifierPriceId) {
        const { ok } = await deleteArticleModifierPrice(articleModifierPriceId, articleId ?? '')
        if (!ok) {
          alert('Error al eliminar el precio')
          return
        }
      }

      setCurrentArticleModifierGroup({
        ...currentArticleModifierGroup,
        prices: currentArticleModifierGroup.prices?.filter((x) => x.menuId !== menuId),
      })
    } else {
      setCurrentArticleModifierGroup({
        ...currentArticleModifierGroup!,
        prices: [
          ...(currentArticleModifierGroup?.prices ?? []),
          {
            id: '',
            menuId,
            price: 0,
            articleModifierId: currentArticleModifierGroup?.id ?? '',
          },
        ],
      })
    }
  }

  const setMenuPrice = (menuId: string, price: number) => {
    setCurrentArticleModifierGroup({
      ...currentArticleModifierGroup!,
      prices: currentArticleModifierGroup?.prices?.map((x) => (x.menuId === menuId ? { ...x, price } : x)),
    })
  }

  useEffect(() => {
    if (articleModifierGroup !== null) {
      if (articleModifierGroup.id) {
        setBtnText('Actualizar')
        setValue('id', articleModifierGroup.id)
      }
      setValue('articleId', articleModifierGroup.articleId)
      setValue('modifierGroupId', articleModifierGroup.modifierGroupId)
      setValue('order', articleModifierGroup.order)
      setValue('minSelect', articleModifierGroup.minSelect)
      setValue('maxSelect', articleModifierGroup.maxSelect)
      setValue('priceByGroup', articleModifierGroup.priceByGroup)
      setValue('prices', articleModifierGroup.prices)
    } else {
      reset()
    }
    setCurrentArticleModifierGroup(articleModifierGroup)
  }, [articleModifierGroup])


  return (
    <>
      <div
        className={clsx(
          'w-full transition-all top-2 z-50 h-6/6 overflow-y-scroll right-0 py-14 px-4 md:w-2/5 mt-16 flex absolute justify-center flex-wrap rounded shadow-2xl bg-gray-100',
          {
            'translate-x-full': !showForm,
          }
        )}
      >
        <IoCloseCircleOutline
          onClick={() => setShowForm(false)}
          className=' cursor-pointer text-4xl absolute text-red-800 left-3 top-3 hover:text-red-700'
        />
        {articleId === undefined || articleId == '' ? (
          <div className='flex flex-col items-center justify-center w-full'>
            <p className='text-red-800 font-bold text-center'>
              Debe agregar el articulo para acceder a los modificadores
            </p>
          </div>
        ) : (
          <>
            <Title className='w-full text-center my-10' title='Modificadores disponibles' />
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 w-full'>
              <div className='flex flex-col mb-4'>
                <span className='font-bold text-sm antialiased'>Modificadores</span>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='flex flex-col'>
                    <select
                      disabled={articleModifierGroup?.id !== undefined}
                      {...register('modifierGroupId', { required: 'El modificador es obligatorio' })}
                      className='p-2 border rounded-md bg-gray-100'
                    >
                      <option value=''>[Seleccione]</option>
                      {modifierGroups.map((modifier) => (
                        <option key={modifier.id} value={modifier.id}>
                          {modifier.name}
                        </option>
                      ))}
                      {
                        articleModifierGroup?.modifierGroup && (
                          <option key={articleModifierGroup?.modifierGroup.id} value={articleModifierGroup?.modifierGroup.id}>
                          {articleModifierGroup?.modifierGroup.name}
                        </option>
                        )
                      }
                    </select>
                    <ErrorMessage
                      errors={errors}
                      name='modifierGroupId'
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
                <span className='font-bold text-sm antialiased'>Orden</span>
                <input
                  {...register('order', { required: 'El orden es obligatorio', min: 1 })}
                  type='number'
                  className='p-2 border rounded-md bg-gray-100'
                />
                <ErrorMessage
                  errors={errors}
                  name='order'
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
                <span className='font-bold text-sm antialiased'>Minimo seleccionable</span>
                <input {...register('minSelect', { required: 'El minimo es obligatorio', min: 1 })} type='number' className='p-2 border rounded-md bg-gray-100' />
                <ErrorMessage
                  errors={errors}
                  name='minSelect'
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
                <span className='font-bold text-sm antialiased'>Maximo seleccionable</span>
                <input {...register('maxSelect', { required: 'El maximo es obligatorio', min: 1 })} type='number' className='p-2 border rounded-md bg-gray-100' />
                <ErrorMessage
                  errors={errors}
                  name='maxSelect'
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
                  {...register('priceByGroup')}
                  id='priceByGroup'
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <label
                  htmlFor='priceByGroup'
                  className='ms-2 py-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
                >
                  Precio por grupo
                </label>
              </div>
              {getValues('priceByGroup') &&
                menus.map((menu) => (
                  <div key={menu.id} className='flex items-center mt-1 pl-2'>
                    <input
                      checked={inputMustBeChecked(menu.id)}
                      onChange={() =>
                        includeMenu(menu.id, currentArticleModifierGroup?.prices?.find((x) => x.menuId === menu.id)?.id)
                      }
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
                    {currentArticleModifierGroup?.prices?.some((x) => x.menuId === menu.id) && (
                      <div className='flex flex-wrap'>
                        <input
                          value={currentArticleModifierGroup?.prices?.find((x) => x.menuId === menu.id)?.price}
                          onChange={(e) => setMenuPrice(menu.id, Number(e.target.value))}
                          placeholder='Precio'
                          type='number'
                          className='px-2 py-1 text-sm border rounded-md bg-gray-100'
                        />
                      </div>
                    )}
                  </div>
                ))}
              <div className='flex gap-3 flex-wrap justify-center mt-4 w-full'>
                <button
                  type='submit'
                  className={clsx('text-white font-bold w-1/3 rounded bg-green-600 hover:bg-green-500 py-2 cursor-pointer', { })}
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
