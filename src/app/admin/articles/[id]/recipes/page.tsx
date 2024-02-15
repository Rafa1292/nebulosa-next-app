import { getPaginatedArticles, getRecipeByArticleId } from '@/actions'
import { TableList } from '@/components/view-data/table/TableList'
import Link from 'next/link'
import { CiEdit } from 'react-icons/ci'
import { FaTrashCan } from 'react-icons/fa6'

interface Props {
  params: {
    id: string
  }
}

export default async function ArticleRecipesPage({ params }: Props) {
  const id = params.id

  const { recipe } = await getRecipeByArticleId(id)
  return (
    <>
      <TableList
        showPagination={false}
        totalPages={1}
        tableTitle='Recetas'
        buttonTitle='Agregar receta'
        buttonRef={`/admin/articles/${id}/recipes/add`}
        heads={['Nombre', '']}
      >
        {recipe && (
          <tr key={recipe.id} className='bg-green-800 border-b transition duration-300 ease-in-out hover:bg-green-600'>
            <td className='text-sm font-bold text-white px-6 py-4 text-center whitespace-nowrap'>{recipe.name}</td>
            <td className='text-sm font-bold text-white px-6 py-4 justify-center flex gap-6'>
              <Link href={`/admin/articles/${id}/recipes/${recipe.id}`} className='font-bold text-2xl cursor-pointer'>
                <CiEdit className='font-bold text-2xl cursor-pointer hover:text-gray-600' />
              </Link>
              <Link href={`/admin/articles/${id}/recipes/${recipe.id}/delete`} className='font-bold text-2xl cursor-pointer'>
                <FaTrashCan className='font-bold text-xl text-white cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all' />
              </Link>
            </td>
          </tr>
        )}
      </TableList>
    </>
  )
}
