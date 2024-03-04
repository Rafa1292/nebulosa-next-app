'use client'

import { Provider, Route } from '@/interfaces'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { createUpdateProvider } from '@/actions'
import { useRouter } from 'next/navigation'

interface Props {
  provider: Partial<Provider>
}

const routes = ['L', 'K', 'M', 'J', 'V', 'S', 'D']

interface FormInputs {
  id: string
  name: string
  phone: string
  email: string
  routes: Route[]
  fixedExpense: boolean
}

export const ProviderForm = ({ provider }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...provider,
      routes: provider.routes ?? [],
    },
  })

  watch('routes')

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (provider.id) {
      formData.append('id', provider.id)
    }
    formData.append('name', data.name)
    formData.append('phone', data.phone)
    formData.append('email', data.email)
    formData.append('routes', data.routes.toString())
    formData.append('fixedExpense', data.fixedExpense.toString() ?? 'false')

    const { ok, message } = await createUpdateProvider(formData)
    if (ok) {
      router.push('/admin/providers')
    } else {
      alert(message)
    }
  }

  const onRouteChange = (route: string) => {
    const routes = new Set(getValues('routes'))
    if (routes.has(route as Route)) {
      routes.delete(route as Route)
    } else {
      routes.add(route as Route)
    }
    setValue('routes', Array.from(routes) as Route[])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid  grid-cols-1 w-full px-8 md:px-48'>
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
          <span className='font-bold text-sm antialiased'>Telefono</span>
          <input
            {...register('phone', { required: 'El telefono es obligatorio' })}
            type='text'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='phone'
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
          <span className='font-bold text-sm antialiased'>Correo</span>
          <input
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Correo invalido',
              },
            })}
            type='text'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='email'
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
        <div className='flex flex-col mb-6'>
          <span className='font-bold text-sm antialiased'>Ruta</span>
          <div className='flex flex-wrap'>
            {routes.map((route) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                onClick={() => onRouteChange(route)}
                key={route}
                className={clsx(
                  'p-2 border rounded-md mr-2 w-14 transition-all cursor-pointer text-center  hover:bg-blue-500 hover:text-white',
                  {
                    'bg-blue-500 text-white': getValues('routes').includes(route as Route),
                    'bg-gray-200 text-black': !getValues('routes').includes(route as Route),
                  }
                )}
              >
                <span>{route}</span>
              </div>
            ))}
            {!isValid && getValues('routes').length < 1 && (
              <p className='text-red-900 text-sm font-bold pt-2'>Debe seleccionar almenos 1 dia</p>
            )}
          </div>
        </div>
        <div className='flex items-center mb-4'>
          <input
            id='fixedExpense'
            type='checkbox'
            {...register('fixedExpense')}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
          />
          <label
            htmlFor='fixedExpense'
            className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'
          >
            Gasto fijo
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
