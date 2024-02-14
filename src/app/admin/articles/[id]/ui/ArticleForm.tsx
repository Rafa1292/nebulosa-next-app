'use client'

import { Article } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { createUpdateArticle } from '@/actions'

interface Props {
  article: Partial<Article>
}

interface FormInputs {
  id: string
  name: string
  description: string | null
  needsCommand: boolean
  active: boolean
}

export const ArticleForm = ({ article }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...article,
    },
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (article.id) {
      formData.append('id', article.id)
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
          <label
            htmlFor='active'
            className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
          >
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
    </form>
  )
}
