'use client'

import { Input, Preparation, Recipe, RecipeInput, RecipePreparation, measures } from '@/interfaces'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import {
  createUpdateRecipe,
  createUpdateRecipeInput,
  createUpdateRecipePreparation,
  deleteRecipeInput,
  deleteRecipePreparation,
  getRecipeById,
} from '@/actions'
import { useRouter } from 'next/navigation'
import { RecipePreparationForm } from './RecipePreparationForm'
import { useState } from 'react'
import { RecipeInputForm } from './RecipeInputForm'
import { CiEdit } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'

interface Props {
  recipe: Partial<Recipe>
  articleId: string
  inputs: Input[]
  preparations: Preparation[]
}

interface FormInputs {
  id: string
  name: string
  cost: number
}

export const RecipeForm = ({ recipe, articleId, inputs, preparations }: Props) => {
  const router = useRouter()
  const [showPreparationForm, setShowPreparationForm] = useState(false)
  const [showInputForm, setShowInputForm] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState<Partial<Recipe>>(recipe)
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm<FormInputs>({ criteriaMode: 'all', defaultValues: { ...currentRecipe } })
  const [recipePreparation, setRecipePreparation] = useState<RecipePreparation | null>(null)
  const [recipeInput, setRecipeInput] = useState<RecipeInput | null>(null)

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData()

    if (currentRecipe.id) {
      formData.append('id', currentRecipe.id)
    }
    formData.append('name', data.name)
    formData.append('cost', data.cost.toString())
    formData.append('articleId', articleId)

    const { ok, message } = await createUpdateRecipe(formData)
    if (ok) {
      router.push(`/admin/articles/${articleId}/recipes`)
    } else {
      alert(message)
    }
  }

  const addRecipePreparation = async (recipePreparation: RecipePreparation) => {
    const { ok } = await createUpdateRecipePreparation(recipePreparation, articleId)
    if (ok) {
      getRecipe()
      setRecipePreparation(null)
    }
  }

  const addRecipeInput = async (recipeInput: RecipeInput) => {
    const { ok } = await createUpdateRecipeInput(recipeInput, articleId)
    if (ok) {
      getRecipe()
      setRecipeInput(null)
    }
  }

  const setRecipePreparationToEdit = (recipePreparationId: string) => {
    const recipePreparation = currentRecipe.recipePreparations?.find((x) => x.id === recipePreparationId)
    if (recipePreparation) {
      setRecipePreparation(recipePreparation)
      setShowPreparationForm(true)
    }
  }

  const setRecipeInputToEdit = (recipeInputId: string) => {
    const recipeInput = currentRecipe.recipeInputs?.find((x) => x.id === recipeInputId)
    if (recipeInput) {
      setRecipeInput(recipeInput)
      setShowInputForm(true)
    }
  }

  const deleteCurrentRecipePreparation = async (recipePreparationId: string) => {
    const { ok } = await deleteRecipePreparation(recipePreparationId, articleId)
    if (ok) {
      getRecipe()
    }
  }

  const deleteCurrentRecipeInput = async (recipeInputId: string) => {
    const { ok } = await deleteRecipeInput(recipeInputId, articleId)
    if (ok) {
      getRecipe()
    }
  }

  const getRecipe = async () => {
    if (currentRecipe.id) {
      const { recipe } = await getRecipeById(currentRecipe.id)
      if (recipe) {
        setCurrentRecipe(recipe)
      }
    }
  }

  return (
    <div
      className={clsx('w-full flex transition-all flex-wrap px-10', {
        'justify-left': showPreparationForm || showInputForm,
        'justify-center': !showPreparationForm && !showInputForm,
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
            <span className='font-bold text-sm antialiased'>Costo</span>
            <input
              {...register('cost', { required: 'El costo es obligatorio' })}
              type='number'
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
          {currentRecipe.id !== undefined && currentRecipe.id !== 'add' && (
            <>
              <div className='flex flex-col mb-4 mt-5' onClick={() => setShowPreparationForm(!showPreparationForm)}>
                <span className='w-full select-none cursor-pointer text-sm text-left hover:text-blue-600 text-blue-800'>
                  + Agregar preparacion
                </span>
              </div>
              <div className='flex flex-col mb-4 mt-5' onClick={() => setShowInputForm(!showInputForm)}>
                <span className='w-full select-none cursor-pointer text-sm text-left hover:text-blue-600 text-blue-800'>
                  + Agregar insumo
                </span>
              </div>
            </>
          )}
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
          <div className='w-full flex flex-wrap'>
            {recipe.recipePreparations?.map((tmpRecipePreparation, index) => (
              <div
                key={`${tmpRecipePreparation.measureSlug}${tmpRecipePreparation.preparationId}${index}`}
                className='w-full font-bold antialiased flex  gap-2 py-2'
              >
                <span className='w-20 text-left select-none'>- {tmpRecipePreparation.quantity}</span>
                <span className='w-24 select-none'>
                  {measures.find((x) => x.slug === tmpRecipePreparation.measureSlug)?.name}
                </span>
                <span className=' w-36 select-none'>
                  {preparations.find((x) => x.id === tmpRecipePreparation.preparationId)?.name}
                </span>
                <span className='flex items-center gap-4'>
                  <CiEdit
                    onClick={() => setRecipePreparationToEdit(tmpRecipePreparation.id)}
                    className='font-bold text-2xl cursor-pointer hover:text-gray-700'
                  />
                  <IoClose
                    onClick={() => deleteCurrentRecipePreparation(tmpRecipePreparation.id)}
                    className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all'
                  />
                </span>
              </div>
            ))}
          </div>
          <div className='w-full flex flex-wrap'>
            {recipe.recipeInputs?.map((tmpRecipeInput, index) => (
              <div
                key={`${tmpRecipeInput.measureSlug}${tmpRecipeInput.inputId}${index}`}
                className='w-full font-bold antialiased flex  gap-2 py-2'
              >
                <span className='w-20 text-left select-none'>- {tmpRecipeInput.quantity}</span>
                <span className='w-24 select-none'>
                  {measures.find((x) => x.slug === tmpRecipeInput.measureSlug)?.name}
                </span>
                <span className=' w-36 select-none'>
                  {inputs.find((x) => x.id === tmpRecipeInput.inputId)?.name}
                </span>
                <span className='flex items-center gap-4'>
                  <CiEdit
                    onClick={() => setRecipeInputToEdit(tmpRecipeInput.id)}
                    className='font-bold text-2xl cursor-pointer hover:text-gray-700'
                  />
                  <IoClose
                    onClick={() => deleteCurrentRecipeInput(tmpRecipeInput.id)}
                    className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all'
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </form>
      <RecipePreparationForm
        recipeId={currentRecipe.id}
        addRecipePreparation={addRecipePreparation}
        preparations={preparations.filter((x) =>
          !currentRecipe.recipePreparations?.some((y) => y.preparationId === x.id)
          )}
        recipePreparation={recipePreparation}
        showForm={showPreparationForm}
        setShowForm={setShowPreparationForm}
      />

      <RecipeInputForm
        recipeId={currentRecipe.id}
        addRecipeInput={addRecipeInput}
        inputs={inputs.filter((x) =>
          !currentRecipe.recipeInputs?.some((y) => y.inputId === x.id)
          )}
        recipeInput={recipeInput}
        showForm={showInputForm}
        setShowForm={setShowInputForm}
      />
    </div>
  )
}
