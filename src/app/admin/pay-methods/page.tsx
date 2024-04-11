import { getPaginatedBrands, getPaginatedPayMethods } from '@/actions'
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

export default async function PayMethodsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  const { payMethods = [], totalPages } = await getPaginatedPayMethods({ page, take: limit })
  return (
    <>
      <TableList
        totalPages={totalPages}
        tableTitle='Formas de pago'
        buttonTitle='Agregar forma  de pago'
        buttonRef='/admin/pay-methods/add'
        heads={['Nombre', 'comision', '']}
      >
        {payMethods.map((payMethod) => (
          <tr key={payMethod.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{payMethod.name}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{payMethod.commission}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 justify-center flex gap-6'>
              <Link href={`/admin/pay-methods/${payMethod.id}`} className='font-bold text-2xl cursor-pointer'>
                <CiEdit className='font-bold text-2xl cursor-pointer' />
              </Link>
              <Link href={`/admin/pay-methods/${payMethod.id}/delete`} className='font-bold text-2xl cursor-pointer'>
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
