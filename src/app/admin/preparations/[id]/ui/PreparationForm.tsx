'use client'

import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { createUpdatePreparation, createUpdatePreparationInput, deletePreparationInput, getPreparationById } from '@/actions'
import { Input, PreparationInput, measures } from '@/interfaces'
import { useEffect, useState } from 'react'
import { Title } from '@/components'
import { PreparationInputForm } from './PreparationInputForm'
import { CiEdit } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'

interface Props {
  inputs: Input[]
  title: string
  id: string | null
}

interface FormInputs {
  id: string
  name: string
  presentation: number
  cost: number
  measureSlug: string
}

export const PreparationForm = ({ inputs, title, id }: Props) => {
  const [preparationInput, setPreparationInput] = useState<PreparationInput | null>(null)
  const [showInputForm, setShowInputForm] = useState(false)
  const [preparationInputs, setPreparationInputs] = useState<PreparationInput[]>([])
  const {
    handleSubmit,
    register,
    setValue,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
  })

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (id) {
      formData.append('id', id)
    }
    formData.append('name', data.name)
    formData.append('cost', data.cost.toString())
    formData.append('presentation', data.presentation.toString())
    formData.append('measureSlug', data.measureSlug)

    const { ok, message, preparationId } = await createUpdatePreparation(formData)

    if (ok && preparationId) {
      getPreparation(preparationId)
    } else {
      alert(message)
    }
  }

  const getPreparation = async (id: string) => {
    if (!id) return
    const { preparation } = await getPreparationById(id)
    if (preparation) {
      setPreparationInputs(preparation.PreparationInputs)
      setValue('name', preparation.name)
      setValue('cost', preparation.cost)
      setValue('presentation', preparation.presentation)
      setValue('measureSlug', preparation.measureSlug)
    }
  }

  const addPreparationInput = async (preparationInput: PreparationInput) => {
    if (id) {
      const { ok } = await createUpdatePreparationInput({...preparationInput, preparationId: id})
      if (ok && id) {
        getPreparation(id)
      }
    }
    setPreparationInput(null)
  }

  const deleteCurrentPreparationInput = async (preparationInputId: string) => {
    const {ok} = await deletePreparationInput(preparationInputId)

    if (ok && id) {
      await getPreparation(id)
    }
  }

  const editPreparationInput = (preparationInputId: string) => {
    const preparationInput = preparationInputs.find((x) => x.id === preparationInputId)
    if (preparationInput) {
      setPreparationInput(preparationInput)
      setShowInputForm(true)
    }
  }

  useEffect(() => {
    if (id) getPreparation(id)
  }, [id])

  return (
    <div
      className={clsx('w-full flex transition-all flex-wrap px-10', {
        'justify-left': showInputForm,
        'justify-center': !showInputForm,
      })}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 w-full md:w-3/5'>
        <Title className='text-center w-full' title={title} />
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
            <span className='font-bold text-sm antialiased'>Costo</span>
            <input
              {...register('cost', { required: 'El costo es obligatorio' })}
              type='text'
              className='p-2 border rounded-md bg-gray-100'
            />
            <ErrorMessage
              errors={errors}
              name='cost'
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
            <span className='font-bold text-sm antialiased'>Presentacion</span>
            <input
              {...register('presentation', {
                required: 'La presentacion es obligatoria',
              })}
              type='text'
              className='p-2 border rounded-md bg-gray-100'
            />
            <ErrorMessage
              errors={errors}
              name='presentation'
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
          <div className='flex flex-col mb-4 mt-5' onClick={() => setShowInputForm(!showInputForm)}>
            <span className='w-full select-none cursor-pointer text-sm text-left hover:text-blue-600 text-blue-800'>
              + Agregar insumo
            </span>
          </div>
          <div className='w-full flex flex-wrap'>
            {preparationInputs.map((tmpPreparationInput, index) => (
              <div
                key={`${tmpPreparationInput.measureSlug}${tmpPreparationInput.inputId}${index}`}
                className='w-full font-bold antialiased flex  gap-2 py-2'
              >
                <span className='w-20 text-left'>- {tmpPreparationInput.quantity}</span>
                <span className='w-24'>{measures.find((x) => x.slug === tmpPreparationInput.measureSlug)?.name}</span>
                <span className=' w-36'>{inputs.find((x) => x.id === tmpPreparationInput.inputId)?.name}</span>
                <span className='flex items-center gap-4'>
                  <CiEdit
                    onClick={() => editPreparationInput(tmpPreparationInput.id)}
                    className='font-bold text-2xl cursor-pointer hover:text-gray-700'
                  />
                  <IoClose
                  onClick={() => deleteCurrentPreparationInput(tmpPreparationInput.id)}
                  className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all' />
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>
      <PreparationInputForm
        setPreparationInput={setPreparationInput}
        addPreparationInput={addPreparationInput}
        setShowForm={setShowInputForm}
        showForm={showInputForm}
        inputs={inputs.filter((input) => !preparationInputs.some((x) => x.inputId === input.id))}
        preparationInput={preparationInput}
      />
    </div>
  )
}
