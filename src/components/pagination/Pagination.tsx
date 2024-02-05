'use client'
import { generatePagination } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import React from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface Props {
  totalPages: number
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageString = searchParams.get('page')?? 1
  let currentPage = isNaN(+pageString) ? 1 : +pageString
  if ( currentPage < 1 ) redirect(pathname + '?page=1')

  const allPages = generatePagination(currentPage, totalPages)

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)

    if (pageNumber === '...') {
      return `${pathname}?${params.toString()}`
    }

    if (+pageNumber <= 0) {
      return `${pathname}?page=1`
    }

    if (+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`
    }

    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className='flex justify-center text-center mt-10 mb-32'>
      <nav aria-label='Page navigation example'>
        <ul className='flex list-style-none'>
          <li className='page-item'>
            <Link
              className='page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none'
              href={createPageUrl(currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>
          {allPages.map((pageNumber, index) => (
            <li key={index} className='page-item '>
              <a
                className={clsx(
                  'page-link relative mx-1 block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800  focus:shadow-none',
                  {
                    'bg-blue-500 shadow-sm text-white hover:text-white hover:bg-blue-600': pageNumber === currentPage,
                  },
                  {
                    'hover:bg-gray-300': pageNumber !== currentPage,
                  }
                )}
                href={createPageUrl(pageNumber)}
              >
                {pageNumber}
              </a>
            </li>
          ))}

          <li className='page-item'>
            <Link
              className='page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none'
              href={createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
