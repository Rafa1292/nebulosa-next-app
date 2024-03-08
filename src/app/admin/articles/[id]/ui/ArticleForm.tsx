'use client'

import { Article, ArticleModifierGroup, Menu, ModifierGroup } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import {
  createUpdateArticle,
  createUpdateArticleModifierGroup,
  deleteArticleModifierGroup,
  getArticleById,
} from '@/actions'
import { titleFont } from '@/config/fonts'
import { useState } from 'react'
import { ArticleModifierGroupForm } from './ArticleModifierGroupForm'
import { CiEdit } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'

interface Props {
  article: Partial<Article>
  modifierGroups: ModifierGroup[]
  menus: Menu[]
}

interface FormInputs {
  id: string
  name: string
  description: string | null
  needsCommand: boolean
  active: boolean
}

export const ArticleForm = ({ article, modifierGroups, menus }: Props) => {
  const [showForm, setShowForm] = useState(false)
  const [articleModifierGroup, setArticleModifierGroup] = useState<ArticleModifierGroup | null>(null)
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>(article)
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...currentArticle,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (currentArticle.id) {
      formData.append('id', currentArticle.id)
    }
    formData.append('name', data.name)
    formData.append('description', data.description ?? '')
    formData.append('needsCommand', data.needsCommand.toString())
    formData.append('active', data.active.toString())

    const { ok, message } = await createUpdateArticle(formData)
    if (ok) {
      router.push('/admin/articles')
    } else {
      alert(message)
    }
  }

  const addModifier = () => {
    setShowForm(true)
    setArticleModifierGroup(null)
  }

  const getArticle = async () => {
    const { article } = await getArticleById(currentArticle.id ?? '')
    if (article) {
      setCurrentArticle(article)
    }
  }

  const addArticleModifierGroup = async (articleModifierGroup: ArticleModifierGroup) => {
    const { ok, message } = await createUpdateArticleModifierGroup(articleModifierGroup, currentArticle.id ?? '')
    if (ok) {
      getArticle()
      setArticleModifierGroup(null)
      return true
    } else {
      alert(message)
      return false
    }
  }

  const setArticleModifierToEdit = (articleModifierId: string) => {
    const articleModifier = currentArticle.articleModifiers?.find((x) => x.id === articleModifierId)
    if (articleModifier) {
      setArticleModifierGroup(articleModifier)
      setShowForm(true)
    }
  }

  const deleteCurrentArticleModifier = async (articleModifierId: string) => {
    const { ok } = await deleteArticleModifierGroup(articleModifierId)
    if (ok) {
      getArticle()
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
              <span className='font-bold antialiased text-sm'>Descripcion</span>
              <input {...register('description')} type='text' className='p-2 border rounded-md bg-gray-100' />
            </div>
            <div className='flex items-center mb-4'>
              <input
                id='needsCommand'
                type='checkbox'
                {...register('needsCommand')}
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <label
                htmlFor='needsCommand'
                className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
              >
                Comanda
              </label>
            </div>
            <div className='flex items-center mb-4'>
              <input
                id='active'
                type='checkbox'
                {...register('active')}
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <label htmlFor='active' className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'>
                Activo
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
          <hr className='my-5 border-gray-300' />
          <div className='w-full flex mb-4 flex-wrap'>
            <span className={`${titleFont.className} w-2/4 text-xl antialiased font-bold`}>Modificadores</span>
            <div className='flex justify-end items-center w-2/4' onClick={() => addModifier()}>
              <span className='select-none cursor-pointer text-sm hover:text-blue-600 text-blue-800'>
                + Agregar modificador
              </span>
            </div>
            <div className='w-full flex flex-wrap'>
              {currentArticle.articleModifiers?.map((modifiers, index) => (
                <div key={`${modifiers.articleId}${index}`} className='w-full font-bold antialiased flex  gap-2 py-2'>
                  <span className=' w-32 select-none'>
                    {modifierGroups.find((x) => x.id === modifiers.modifierGroupId)?.name}
                  </span>
                  <span className='flex items-center gap-4'>
                    <CiEdit
                      onClick={() => setArticleModifierToEdit(modifiers.id)}
                      className='font-bold text-2xl cursor-pointer hover:text-gray-700'
                    />
                    <IoClose
                      onClick={() => deleteCurrentArticleModifier(modifiers.id)}
                      className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all'
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
      <ArticleModifierGroupForm
        menus={menus}
        showForm={showForm}
        setShowForm={setShowForm}
        articleId={currentArticle.id}
        addArticleModifierGroup={addArticleModifierGroup}
        articleModifierGroup={articleModifierGroup}
        modifierGroups={modifierGroups}
        setArticleModifierGroup={setArticleModifierGroup}
      />
    </>
  )
}
