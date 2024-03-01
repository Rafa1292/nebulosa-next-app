import { getMenus, getPaginatedSaleItems, getSaleItemCategories } from '@/actions'
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

export default async function SaleItemsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  const { saleItemCategories = [] } = await getSaleItemCategories()
  const { saleItems = [], totalPages } = await getPaginatedSaleItems({ page, take: limit })
  const { menus } = await getMenus()
  return (
    <>
      <TableList
        totalPages={totalPages}
        tableTitle='Items de Venta'
        buttonTitle='Agregar Item'
        buttonRef='/admin/sale-items/add'
        heads={['Nombre', 'Precios', 'Categoria', '']}
      >
        {saleItems.map((saleItem) => (
          <tr key={saleItem.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{saleItem.name}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center flex-wrap flex whitespace-nowrap'>
              {saleItem.prices.map((price) => (
                <>
                  <span
                    key={price.id}
                    className='text-sm font-bold text-gray-900 w-2/4 p-2 text-right whitespace-nowrap'
                  >
                    {menus?.find((x) => x.id === price.menuId)?.name}
                  </span>
                  <span
                    key={price.id}
                    className='text-sm font-bold text-gray-900 w-2/4 p-2 text-left whitespace-nowrap'
                  >
                    {price.price}
                  </span>
                </>
              ))}
            </td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>
              {saleItemCategories.find((x) => x.id === saleItem.saleItemCategoryId)?.name}
            </td>
            <td className='text-sm font-bold text-gray-900'>
              <div className='w-full h-full flex jus'>
                <Link href={`/admin/sale-items/${saleItem.id}`} className='font-bold text-2xl p-2 cursor-pointer'>
                  <CiEdit className='font-bold text-2xl cursor-pointer hover:text-gray-500' />
                </Link>
                <Link href={`/admin/sale-items/${saleItem.id}/delete`} className='font-bold p-2 text-2xl cursor-pointer'>
                  <FaTrashCan className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all' />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </TableList>
    </>
  )
}
