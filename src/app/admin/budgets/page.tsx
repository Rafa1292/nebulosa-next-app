import { getPaginatedBudgets } from '@/actions'
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

export default async function BudgetsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 12

  const { budgets = [], totalPages } = await getPaginatedBudgets({ page, take: limit })
  return (
    <>
      <TableList
        totalPages={totalPages}
        tableTitle='Presupuestos'
        buttonTitle='Agregar Presupuesto'
        buttonRef='/admin/budgets/add'
        heads={['Ganancia', 'Gasto', 'Meta -', 'Meta', 'Meta +', 'Fecha',  '']}
      >
        {budgets.map((budget) => (
          <tr key={budget.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{budget.expectedProfit}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{budget.fixedExpense}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{budget.lowerGoal}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{budget.goal}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{budget.upperGoal}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap text-center'>{budget.month}/{budget.year}</td>
            <td className='text-sm font-bold text-gray-900 px-6 py-4 justify-center flex gap-6'>
              <Link href={`/admin/budgets/${budget.id}`} className='font-bold text-2xl cursor-pointer'>
                <CiEdit className='font-bold text-2xl cursor-pointer' />
              </Link>
              <Link href={`/admin/budgets/${budget.id}/delete`} className='font-bold text-2xl cursor-pointer'>
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
