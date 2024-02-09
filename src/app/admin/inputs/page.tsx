import { getPaginatedInputs, getPaginatedProviders } from '@/actions'
import { TableList } from '@/components/view-data/table/TableList'
import { measures } from '@/interfaces'
import Link from 'next/link'
import { CiEdit } from 'react-icons/ci'
import { FaTrashCan } from 'react-icons/fa6'
import { FaEye } from "react-icons/fa6";

interface Props {
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function InputsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  const { inputs = [], totalPages } = await getPaginatedInputs({ page, take: limit })
  return (
    <>
      <TableList
        totalPages={totalPages}
        tableTitle='Insumos'
        buttonTitle='Agregar Insumo'
        buttonRef='/admin/inputs/add'
        heads={['Nombre', 'Precio', 'Presentacion', 'Medida', '']}
      >
        {inputs.map((input) => (
          <tr key={input.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{input.name}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{input.expectedPrice}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{input.presentation}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{measures.find(x => x.slug === input.measureSlug)?.name}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 justify-center flex gap-6'>
              <Link href={`/admin/inputs/${input.id}`} className='font-bold text-2xl cursor-pointer'>
                <CiEdit className='font-bold text-2xl cursor-pointer hover:text-gray-500' />
              </Link>
              <Link href={`/admin/inputs/${input.id}/delete`} className='font-bold text-2xl cursor-pointer'>
              <FaTrashCan
              className='font-bold text-xl text-red-800 cursor-pointer hover:text-red-600 hover:shadow-2xl transition-all'
              />
              </Link>
              <FaEye className='font-bold text-2xl cursor-pointer hover:text-gray-500' />
            </td>
          </tr>
        ))}
      </TableList>
    </>
  )
}
