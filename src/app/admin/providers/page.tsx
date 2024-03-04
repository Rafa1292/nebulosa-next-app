import { getPaginatedProviders } from '@/actions'
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

export default async function ProvidersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  const { providers = [], totalPages } = await getPaginatedProviders({ page, take: limit })
  console.log(providers, totalPages)
  return (
    <>
      <TableList
        totalPages={totalPages}
        tableTitle='Proveedores'
        buttonTitle='Agregar Proveedor'
        buttonRef='/admin/providers/add'
        heads={['Nombre', 'Correo', 'Teléfono', '']}
      >
        {providers.map((provider) => (
          <tr key={provider.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{provider.name}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{provider.email}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{provider.phone}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 justify-center flex gap-6'>
              <Link href={`/admin/providers/${provider.id}`} className='font-bold text-2xl cursor-pointer'>
                <CiEdit className='font-bold text-2xl cursor-pointer' />
              </Link>
              <Link href={`/admin/providers/${provider.id}/delete`} className='font-bold text-2xl cursor-pointer'>
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
