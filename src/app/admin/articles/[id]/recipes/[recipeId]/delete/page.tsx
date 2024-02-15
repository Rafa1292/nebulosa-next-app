'use client'
import { deleteProvider, deleteRecipe, getProviderById, getRecipeById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
    recipeId: string
  }
}

export default function DeleteRecipePage({ params }: Props) {
  const { id, recipeId } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [recipeName, setRecipeName] = useState('')

  useEffect(() => {
    getRecipeById(recipeId).then((res) => {
        if (res.recipe) {
            setRecipeName(res.recipe.name)
        }
        })
    }, [id])


  const onDelete = () => {
    setDeleting(true)
    deleteRecipe(recipeId, id).then((res) => {
      if (res.ok) {
        router.push(`/admin/articles/${id}/recipes`)
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar receta' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar la receta {recipeName}?</span>
      <button
        disabled={deleting}
        onClick={() => onDelete()}
        className={clsx('text-white font-bold py-2 px-4  rounded', {
          'bg-red-800 hover:bg-red-700 cursor-pointer': !deleting,
          'btn-secondary cursor-not-allowed': deleting,
        })}
      >
        Eliminar
      </button>
    </div>
  )
}
