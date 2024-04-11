import { getPaginatedAccounts } from '@/actions'
import { TableList } from '@/components/view-data/table/TableList'
import Link from 'next/link'
import { CiEdit } from 'react-icons/ci'
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaTrashCan } from 'react-icons/fa6'

interface Props {
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function AccountsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  const { accounts = [], totalPages } = await getPaginatedAccounts({ page, take: limit })
  return (
    <>
      <TableList
        totalPages={totalPages}
        tableTitle='Cuentas'
        buttonTitle='Agregar Cuenta'
        buttonRef='/admin/accounts/add'
        heads={['Nombre', '']}
      >
        {accounts.map((account) => (
          <tr key={account.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 text-center whitespace-nowrap'>{account.name}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 justify-center flex gap-6'>
              <Link href={`/admin/accounts/${account.id}`} className='font-bold text-2xl cursor-pointer'>
                <CiEdit className='font-bold text-2xl cursor-pointer' />
              </Link>
              <Link href={`/admin/accounts/${account.id}/delete`} className='font-bold text-2xl cursor-pointer'>
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
