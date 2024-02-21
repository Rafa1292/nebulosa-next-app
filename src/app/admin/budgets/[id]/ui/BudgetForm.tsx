'use client'

import { Budget, months } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import { createUpdateBudget } from '@/actions'
import clsx from 'clsx'
import { currencyFormat } from '@/utils'

interface Props {
  budget: Partial<Budget>
}

interface FormInputs {
  expectedProfit: number
  month: number
  year: number
  inventoryPercentage: number
  fixedExpense: number
}

const getYears = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i < 100; i++) {
    years.push(currentYear + i)
  }
  return years
}

const years = getYears()

export const BudgetForm = ({ budget }: Props) => {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...budget,
    },
  })

  watch('expectedProfit')

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (budget.id) {
      formData.append('id', budget.id)
    }
    formData.append('expectedProfit', data.expectedProfit.toString())
    formData.append('month', data.month.toString())
    formData.append('year', data.year.toString())
    formData.append('inventoryPercentage', data.inventoryPercentage.toString())
    formData.append('fixedExpense', data.fixedExpense.toString())

    const { ok, message } = await createUpdateBudget(formData)
    if (ok) {
      router.push('/admin/budgets')
    } else {
      alert(message)
    }
  }

  const getExpectedProfit = () => {
    const { expectedProfit } = getValues()
    if((expectedProfit === undefined) || isNaN(expectedProfit)) return 0
    return expectedProfit
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid  grid-cols-1 w-full px-8 md:px-48'>
      <div className='mt-5'>
        <div className='flex flex-col mb-4'>
          <span className='font-bold antialiased text-sm'>Ganancia esperada</span>
          <input
            {...register('expectedProfit', { required: 'La ganancia es requerida' })}
            type='number'
            className='p-2 border rounded-md bg-gray-100'
          />
          <span className='font-light antialiased text-sm'>{currencyFormat(getExpectedProfit())}</span>
          <ErrorMessage
            errors={errors}
            name='expectedProfit'
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
          <span className='font-bold antialiased text-sm'>Gasto fijo</span>
          <input
            {...register('fixedExpense', { required: 'El gasto es requerido' })}
            type='number'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='fixedExpense'
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
          <span className='font-bold antialiased text-sm'>Porcentaje de costo</span>
          <input
            {...register('inventoryPercentage', { required: 'El costo es requerido', min: { value: 0, message: 'El costo debe ser mayor a 0' }, max: { value: 100, message: 'El costo debe ser menor a 100' }})}
            type='number'
            className='p-2 border rounded-md bg-gray-100'
          />
          <ErrorMessage
            errors={errors}
            name='inventoryPercentage'
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
          <span className='font-bold text-sm antialiased'>Mes</span>
          <select {...register('month', { required: true })} className='p-2 border rounded-md bg-gray-100'>
            <option value=''>[Seleccione]</option>
            {months.map((month) => (
              <option key={month.id} value={month.id}>
                {month.name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex flex-col mb-4'>
          <span className='font-bold text-sm antialiased'>Año</span>
          <select {...register('year', { required: true })} className='p-2 border rounded-md bg-gray-100'>
            <option value=''>[Seleccione]</option>
            {years.map((year, index) => (
              <option key={`${year}${index}`} value={year}>
                {year}
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
      </div>
    </form>
  )
}
