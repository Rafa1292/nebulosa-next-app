'use client'

import clsx from 'clsx'
import { useState } from 'react'

interface Props {
  show: boolean
}

type BillPayMethodType = 'Completa' | 'Dividir' | 'Separar'

export const BillPayMethodActions = ({ show }: Props) => {
  const [payMethodType, setPayMethodType] = useState<BillPayMethodType>('Completa')
  return (
    <div
      className={clsx('absolute h-screen w-3/5 transition-all bg-white translate-y-full bottom-0 z-20 left-0', {
        '!translate-y-0': show,
      })}
    >
      <div className='w-full flex justify-around p-2'>
        <button
          className={clsx(
            'bg-white border select-none shadow-md border-green-600 text-xs rounded-xl text-green-600 w-1/4 py-1 hover:!text-white hover:!bg-green-600',
            {
              '!bg-green-600 !text-white': payMethodType === 'Completa',
            }
          )}
          onClick={() => setPayMethodType('Completa')}
        >
          Completa
        </button>
        <button
          className={clsx(
            'bg-white border select-none shadow-md border-green-600 text-xs rounded-xl text-green-600 w-1/4 py-1 hover:!text-white hover:!bg-green-600',
            {
              '!bg-green-600 !text-white': payMethodType === 'Dividir',
            }
          )}
          onClick={() => setPayMethodType('Dividir')}
        >
          Dividir
        </button>
        <button
          className={clsx(
            'bg-white border select-none shadow-md border-green-600 text-xs rounded-xl text-green-600 w-1/4 py-1 hover:!text-white hover:!bg-green-600',
            {
              '!bg-green-600 !text-white': payMethodType === 'Separar',
            }
          )}
          onClick={() => setPayMethodType('Separar')}
        >
          Separar
        </button>
      </div>
      
    </div>
  )
}
