'use client'

import { ModifierElement, ModifierGroup, Recipe } from '@/interfaces'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/navigation'
import { createUpdateModifierElement, createUpdateModifierGroup, getModifierGroupById } from '@/actions'
import clsx from 'clsx'
import { ModifierElementForm } from './ModifierElementForm'
import { useState } from 'react'
import { titleFont } from '@/config/fonts'
import { CiEdit } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'

interface Props {
  currentModifierGroup: Partial<ModifierGroup>
  recipes: Recipe[]
}

interface FormInputs {
  id: string
  name: string
  showLabel: boolean
}

export const ModifierGroupForm = ({ currentModifierGroup, recipes }: Props) => {
  const [modifierGroup, setCurrentModifierGroup] = useState<Partial<ModifierGroup>>(currentModifierGroup)
  const [showForm, setShowForm] = useState(false)
  const [modifierElement, setModifierElement] = useState<ModifierElement | null>(null)
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({
    criteriaMode: 'all',
    defaultValues: {
      ...modifierGroup,
    },
  })

  const addModifierElement = async (modifierElement: ModifierElement): Promise<boolean> => {
    const { ok, message } = await createUpdateModifierElement(modifierElement)
    if (ok) {
      setModifierElement(null)
      if (modifierGroup.id) {
        await getCurrentModifierGroupById(modifierGroup.id)
      }
      return true
    } else {
      alert(message)
      return false
    }
  }

  const setModifierElementToEdit = (modifierElementId: string) => {
    const saleItemArticle = currentModifierGroup.elements?.find((x) => x.id === modifierElementId)
    if (saleItemArticle) {
      setModifierElement(saleItemArticle)
      setShowForm(true)
    }
  }

  const getCurrentModifierGroupById = async (id: string) => {
    const { modifierGroup } = await getModifierGroupById(id)
    if (modifierGroup) setCurrentModifierGroup(modifierGroup)
  }

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (modifierGroup.id) {
      formData.append('id', modifierGroup.id)
    }
    formData.append('name', data.name)
    formData.append('showLabel', data.showLabel.toString())

    const { ok, message } = await createUpdateModifierGroup(formData)
    if (ok) {
      router.push('/admin/modifier-groups')
    } else {
      alert(message)
    }
  }

  return (
    <>
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

          <div className='flex items-center mb-4'>
            <input
              {...register('showLabel')}
              id='showLabel'
              type='checkbox'
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-3xl focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
            />
            <label htmlFor='showLabel' className='ms-2 text-sm mr-4 text-gray-900 font-bold cursor-pointer select-none'>
              Mostrar etiqueta
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
          <span className={`${titleFont.className} w-2/4 text-xl antialiased font-bold`}>Elementos</span>
          <div className='flex justify-end items-center w-2/4' onClick={() => setShowForm(!showForm)}>
            <span className='select-none cursor-pointer text-sm hover:text-blue-600 text-blue-800'>
              + Agregar elemento
            </span>
          </div>
        </div>
        <div className='w-full flex flex-wrap'>
          {currentModifierGroup.elements?.map((element, index) => (
            <div key={`${element.id}${index}`} className='w-full font-bold antialiased flex  gap-2 py-2'>
              <span className=' w-32 select-none'>{element.name}</span>
              <span className='flex items-center gap-4'>
                <CiEdit
                  onClick={() => setModifierElementToEdit(element.id)}
                  className='font-bold text-2xl cursor-pointer hover:text-gray-700'
                />
                <IoClose
                  // onClick={() => deleteCurrentSaleItemArticle(element.id)}
                  className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all'
                />
              </span>
            </div>
          ))}
        </div>
      </form>
      <ModifierElementForm
        addModifierElement={addModifierElement}
        modifierGroupId={modifierGroup.id}
        modifierElement={modifierElement}
        recipes={recipes}
        setModifierElement={setModifierElement}
        setShowForm={setShowForm}
        showForm={showForm}
      />
    </>
  )
}
