import { getPaginatedSaleItemCategories } from '@/actions'
import { TableList } from '@/components/view-data/table/TableList'
import Link from 'next/link'
import { CiEdit } from 'react-icons/ci'
import { FaTrashCan } from 'react-icons/fa6'

interface Props {
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function SaleItemCategoriesPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  const { saleItemCategories = [], totalPages } = await getPaginatedSaleItemCategories({ page, take: limit })
  return (
    <>
      <TableList
        totalPages={totalPages}
        tableTitle='Categorias'
        buttonTitle='Agregar Categoria'
        buttonRef='/admin/sale-item-categories/add'
        heads={['Nombre', '']}
      >
        {saleItemCategories.map((category) => (
          <tr key={category.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{category.name}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 justify-center flex gap-6'>
              <Link href={`/admin/sale-item-categories/${category.id}`} className='font-bold text-2xl cursor-pointer'>
                <CiEdit className='font-bold text-2xl cursor-pointer' />
              </Link>
              <Link href={`/admin/sale-item-categories/${category.id}/delete`} className='font-bold text-2xl cursor-pointer'>
              <FaTrashCan
              className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all'
              />
              </Link>
            </td>
          </tr>
        ))}
      </TableList>
    </>
  )
}
