'use client'

import { Article, SaleItem, SaleItemArticle, SaleItemCategory } from '@/interfaces'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { createUpdateSaleItem, createUpdateSaleItemArticle, deleteSaleItem, deleteSaleItemArticle, getSaleItemById } from '@/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SaleItemArticleForm } from './SaleItemArticleForm'
import { CiEdit } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'

interface Props {
  saleItemCategories: SaleItemCategory[]
  saleItem: Partial<SaleItem>
  articles: Article[]
}

interface FormInputs {
  id: string
  name: string
  price: number
  saleItemCategoryId: string
}

export const SaleItemForm = ({ saleItem, articles, saleItemCategories }: Props) => {
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

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (currentSaleItem.id) {
      formData.append('id', currentSaleItem.id)
    }
    formData.append('name', data.name)
    formData.append('price', data.price.toString())
    formData.append('saleItemCategoryId', data.saleItemCategoryId)

    const { ok, message } = await createUpdateSaleItem(formData)
    if (ok) {
      router.push('/admin/sale-items')
    } else {
      alert(message)
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
              <span className='font-bold text-sm antialiased'>Precio</span>
              <input {...register('price')} type='number' className='p-2 border rounded-md bg-gray-100' />
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
            <div className='flex flex-col mb-4 mt-5' onClick={() => setShowForm(!showForm)}>
              <span className='w-full select-none cursor-pointer text-sm text-left hover:text-blue-600 text-blue-800'>
                + Agregar articulo
              </span>
            </div>
          </div>
          <div className='w-full flex flex-wrap'>
            {currentSaleItem.saleItemArticles?.map((saleItemArticle, index) => (
              <div
                key={`${saleItemArticle.quantity}${saleItemArticle.articleId}${index}`}
                className='w-full font-bold antialiased flex  gap-2 py-2'
              >
                <span className='w-10 text-left select-none'>- {saleItemArticle.quantity}</span>
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
