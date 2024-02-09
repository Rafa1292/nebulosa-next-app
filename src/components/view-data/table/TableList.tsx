import Link from 'next/link'
import React, { ReactNode } from 'react'
import { Pagination, Title } from '@/components'

interface Props {
  totalPages?: number
  tableTitle?: string
  buttonTitle?: string
  buttonRef?: string
  heads: string[]
  children: ReactNode
}

export const TableList = ({ buttonTitle, heads, children, buttonRef = '/', tableTitle = '', totalPages = 1 }: Props) => {
  return (
    <>
      <Title title={tableTitle} />
      {buttonTitle && (
        <div className='flex justify-end mb-5'>
          <Link href={buttonRef} className='btn-primary'>
            {buttonTitle}
          </Link>
        </div>
      )}
      <div className='mb-10'>
        <table className='min-w-full'>
          <thead className='bg-gray-200 border-b'>
            <tr>
              {
              heads.map((head, index) => (
                <th key={index} scope='col' className='text-sm text-center font-medium text-gray-900 px-6 py-4 text-left'>
                  {head}
                </th>
              ))
              }
            </tr>
          </thead>
          <tbody>
            {/* <tr key={product.id} className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
              <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap'>{product.inStock}</td>
            </tr> */}
            {children}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} />
      </div>
    </>
  )
}
