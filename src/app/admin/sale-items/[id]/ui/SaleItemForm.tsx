'use client'

import { Article, ItemPrice, Menu, SaleItem, SaleItemArticle, SaleItemCategory } from '@/interfaces'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import {
  createUpdateSaleItem,
  createUpdateSaleItemArticle,
  deleteItemPrice,
  deleteSaleItemArticle,
  getMenus,
  getSaleItemById,
} from '@/actions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SaleItemArticleForm } from './SaleItemArticleForm'
import { CiEdit } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import { titleFont } from '@/config/fonts'

interface Props {
  saleItemCategories: SaleItemCategory[]
  saleItem: Partial<SaleItem>
  articles: Article[]
  menus: Menu[]
}

interface FormInputs {
  id: string
  name: string
  saleItemCategoryId: string
}

export const SaleItemForm = ({ saleItem, articles, saleItemCategories, menus }: Props) => {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [currentSaleItem, setCurrentSaleItem] = useState<Partial<SaleItem>>(saleItem)
  const [saleItemArticle, setSaleItemArticle] = useState<SaleItemArticle | null>(null)
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...saleItem,
    },
  })

  const addSaleItemArticle = async (saleItemArticle: SaleItemArticle) => {
    const { ok } = await createUpdateSaleItemArticle(saleItemArticle, currentSaleItem.id ?? '')
    if (ok) {
      getSaleItem()
      setSaleItemArticle(null)
    }
  }

  const setSaleItemArticleToEdit = (saleItemArticleId: string) => {
    const saleItemArticle = currentSaleItem.saleItemArticles?.find((x) => x.id === saleItemArticleId)
    if (saleItemArticle) {
      setSaleItemArticle(saleItemArticle)
      setShowForm(true)
    }
  }

  const deleteCurrentSaleItemArticle = async (saleItemId: string) => {
    const { ok } = await deleteSaleItemArticle(saleItemId, currentSaleItem.id ?? '')
    if (ok) {
      getSaleItem()
    }
  }

  const getSaleItem = async () => {
    const { saleItem } = await getSaleItemById(currentSaleItem.id ?? '')
    if (saleItem) {
      setCurrentSaleItem(saleItem)
    }
  }

  const setMenuPrice = (menuId: string, price: number) => {
    setCurrentSaleItem({
      ...currentSaleItem,
      prices: currentSaleItem.prices?.map((x) => (x.menuId === menuId ? { ...x, price } : x)),
    })
  }

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()
    let validPrices = true

    if (currentSaleItem.prices) {
      currentSaleItem.prices.forEach((price: ItemPrice) => {
        if (price.price < 1) {
          validPrices = false
          alert('Debes asignar un precio a todos los menus seleccionados')
        } 
      })
    }

    if (!validPrices) {
      return
    }

    if (currentSaleItem.id) {
      formData.append('id', currentSaleItem.id)
    }
    // append prices as array
    if (currentSaleItem.prices) {
        formData.append('prices', JSON.stringify(currentSaleItem.prices))
    }
    formData.append('name', data.name)
    formData.append('saleItemCategoryId', data.saleItemCategoryId)

    const { ok, message } = await createUpdateSaleItem(formData)
    if (ok) {
      router.push('/admin/sale-items')
    } else {
      alert(message)
    }
  }

  const includeMenu = async (menuId: string, itemPriceId?: string) => {
    if (currentSaleItem.prices?.some((x) => x.menuId === menuId)) {
      //if itemPriceComes, delete from db
      if (itemPriceId) {
        const { ok } = await deleteItemPrice(itemPriceId)
        if (!ok) {
          alert('Error al eliminar el precio')
          return
        }
      }
      
      setCurrentSaleItem({
        ...currentSaleItem,
        prices: currentSaleItem.prices?.filter((x) => x.menuId !== menuId),
      })
    } else {
      setCurrentSaleItem({
        ...currentSaleItem,
        prices: [
          ...(currentSaleItem.prices ?? []),
          {
            id: '',
            menuId,
            price: 0,
            saleItemId: currentSaleItem.id ?? '',
          },
        ],
      })
    }
  }

  return (
    <>
      <div
        className={clsx('w-full flex transition-all flex-wrap px-10', {
          'justify-left': showForm,
          'justify-center': !showForm,
        })}
      >
        <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 w-full md:w-3/5'>
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
              <span className='font-bold text-sm antialiased'>Categoria</span>
              <select
                {...register('saleItemCategoryId', { required: true })}
                className='p-2 border rounded-md bg-gray-100'
              >
                <option value=''>[Seleccione]</option>
                {saleItemCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <span className='font-bold text-sm antialiased'>Precios</span>
            {/* menus aqui */}
            {menus.map((menu) => (
              <div key={menu.id} className='flex items-center mt-3 pl-2'>
                <input
                  checked={currentSaleItem.prices?.some((x) => x.menuId === menu.id)}
                  onChange={() => includeMenu(menu.id, currentSaleItem.prices?.find((x) => x.menuId === menu.id)?.id)}
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
                {currentSaleItem.prices?.some((x) => x.menuId === menu.id) && (
                  <div className='flex flex-wrap'>
                    <input
                      value={currentSaleItem.prices?.find((x) => x.menuId === menu.id)?.price}
                      onChange={(e) => setMenuPrice(menu.id, Number(e.target.value))}
                      placeholder='Precio'
                      type='number'
                      className='px-2 py-1 text-sm border rounded-md bg-gray-100'
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type='submit'
              disabled={!isValid}
              className={clsx('text-white font-bold py-2 px-4 mt-5  rounded', {
                'bg-blue-600 hover:bg-blue-500 cursor-pointer': isValid,
                'btn-secondary cursor-not-allowed': !isValid,
              })}
            >
              Guardar
            </button>
            <hr className='my-5 border-gray-300' />
            <div className='w-full flex mb-4 flex-wrap'>
              <span className={`${titleFont.className} w-2/4 text-xl antialiased font-bold`}>Articulos</span>
              <div className='flex justify-end items-center w-2/4' onClick={() => setShowForm(!showForm)}>
                <span className='select-none cursor-pointer text-sm hover:text-blue-600 text-blue-800'>
                  + Agregar articulo
                </span>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-wrap'>
            {currentSaleItem.saleItemArticles?.map((saleItemArticle, index) => (
              <div
                key={`${saleItemArticle.quantity}${saleItemArticle.articleId}${index}`}
                className='w-full font-bold antialiased flex  gap-2 py-2'
              >
                <span className='w-8 text-center select-none'> {saleItemArticle.quantity}</span>
                <span className=' w-32 select-none'>
                  {articles.find((x) => x.id === saleItemArticle.articleId)?.name}
                </span>
                <span className='flex items-center gap-4'>
                  <CiEdit
                    onClick={() => setSaleItemArticleToEdit(saleItemArticle.id)}
                    className='font-bold text-2xl cursor-pointer hover:text-gray-700'
                  />
                  <IoClose
                    onClick={() => deleteCurrentSaleItemArticle(saleItemArticle.id)}
                    className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all'
                  />
                </span>
              </div>
            ))}
          </div>
        </form>
      </div>

      <SaleItemArticleForm
      setSaleItemArticle={setSaleItemArticle}
        saleItemArticle={saleItemArticle}
        showForm={showForm}
        setShowForm={setShowForm}
        articles={articles}
        saleItemId={currentSaleItem.id ?? ''}
        addSaleItemArticle={addSaleItemArticle}
      />
    </>
  )
}
