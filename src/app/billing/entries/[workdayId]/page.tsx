import { getEntriesByWorkDay } from '@/actions'
import { EntryForm } from '../ui/EntryForm'
import { currencyFormat } from '@/utils'

interface Props {
  params: {
    workDayId: string
  }
}

export default async function EntriesPage({ params }: Props) {
  const { workDayId } = params
  const { entries } = await getEntriesByWorkDay(workDayId)

  return (
    <div className='w-full flex-wrap relative h-screen justify-center flex'>
      <span className=' absolute top-[20vh] text-xl w-full mb-10 text-center font-semibold h-fit italic'>Entradas</span>

      <div className='absolute left-2 top-[30vh]'>
        <EntryForm />
      </div>
      {!entries || entries.length === 0 ? (
        <div className='text-center ml-[320px] font-bold pt-[30vh]'>No hay ingresos en esta jornada</div>
      ) : (
        <div className='w-full pl-[320px] flex-wrap justify-center flex pt-[30vh] h-fit'>
          <div className='w-1/4 font-semibold border-b border-gray-600 mb-2 text-right pr-1 italic'>Detalle</div>
          <div className='w-1/4 font-semibold border-b border-gray-600 mb-2 text-left pl-1 italic'>Monto</div>
          {entries.map((entry, index) => (
            <div key={index} className=' w-full flex justify-center'>
              <div className='w-1/4 text-right pr-1 '>{entry.description}</div>
              <div className='w-1/4 font-bold text-left pl-1'>{currencyFormat(entry.accountHistory.amount)}</div>
            </div>
          ))}
          <div className='flex flex-wrap w-full justify-center pt-4 '>
            <div className='w-1/4 border-t border-gray-600 font-bold text-right pr-1'>Total</div>
            <div className='w-1/4 border-t border-gray-600 font-bold text-left pl-1'>
              {currencyFormat(entries.reduce((acc, entry) => acc + entry.accountHistory.amount, 0))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
