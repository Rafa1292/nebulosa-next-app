'use client'
import { deleteArticle, deleteProvider, getArticleById, getProviderById } from '@/actions'
import { Title } from '@/components'
import clsx from 'clsx'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  params: {
    id: string
  }
}

export default function DeleteArticlePage({ params }: Props) {
  const { id } = params
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const [articleName, setArticleName] = useState('')

  useEffect(() => {
    getArticleById(id).then((res) => {
        if (res.article) {
            setArticleName(res.article.name)
        }
        })
    }, [id])


  const onDelete = () => {
    setDeleting(true)
    deleteArticle(id).then((res) => {
      if (res.ok) {
        router.push('/admin/articles')
      } else {
        setDeleting(false)
      }
    })
  }

  return (
    <div className='w-full justify-center flex flex-wrap mt-10'>
      <Title title='Eliminar articulo' />
      <span className='w-full text-center my-8'>¿Estas seguro que deseas eliminar el articulo {articleName}?</span>
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
