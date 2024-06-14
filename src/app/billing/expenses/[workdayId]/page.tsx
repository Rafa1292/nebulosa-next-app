import { getEntriesByWorkDay, getExpensesByWorkDay } from '@/actions'
import { currencyFormat } from '@/utils'
import { ExpenseForm } from '../ui/ExpenseForm'
import { getProviders } from '@/actions/provider/get-providers'

interface Props {
  params: {
    workDayId: string
  }
}

export default async function ExpensesPage({ params }: Props) {
  const { workDayId } = params
  const { expenses } = await getExpensesByWorkDay(workDayId)
  const { providers } = await getProviders()

  return (
    <div className='w-full flex-wrap relative h-screen justify-center flex'>
      <span className=' absolute top-[20vh] text-xl w-full mb-10 text-center font-semibold h-fit italic'>Gastos</span>

      <div className='absolute left-2 top-[30vh]'>
        <ExpenseForm providers={providers ?? []} />
      </div>
      {!expenses || expenses.length === 0 ? (
        <div className='text-center ml-[320px] font-bold pt-[30vh]'>No hay gastos en esta jornada</div>
      ) : (
        <div className='w-full pl-[320px] flex-wrap justify-center flex pt-[30vh] h-fit'>
          <div className='w-1/4 font-semibold border-b border-gray-600 mb-2 text-right pr-1 italic'>Detalle</div>
          <div className='w-1/4 font-semibold border-b border-gray-600 mb-2 text-left pl-1 italic'>Monto</div>
          {expenses.map((expense, index) => (
            <div key={index} className=' w-full flex justify-center'>
              <div className='w-full text-right pr-1 '>{expense.description}</div>
              {expense.expenseAccountHistories.map((expenseHistory, index2) => (
                <div key={index2}>
                  <div className='w-1/4 font-bold text-left pl-1'>
                    {expenseHistory.AccountHistory.PayMethod.name}
                  </div>
                  <div className='w-1/4 font-bold text-left pl-1'>{currencyFormat(expenseHistory.AccountHistory.amount)}</div>
                </div>
              ))}
            </div>
          ))}
          <div className='flex flex-wrap w-full justify-center pt-4 '>
            <div className='w-1/4 border-t border-gray-600 font-bold text-right pr-1'>Total</div>
            <div className='w-1/4 border-t border-gray-600 font-bold text-left pl-1'>
              {currencyFormat(
                expenses.reduce((acc, expense) => {
                  return (
                    acc +
                    expense.expenseAccountHistories.reduce((acc2, expenseHistory) => {
                      return acc2 + expenseHistory.AccountHistory.amount
                    }, 0)
                  )
                }, 0)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
