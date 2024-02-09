'use client'

import { subTitleFont } from '@/config/fonts'
import clsx from 'clsx'
import { useState } from 'react'

interface Props {
  children: React.ReactNode
  title: string
}

export const Dropdown = ({ title, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='relative'>
      <button onClick={toggleMenu} className={clsx(
        ` w-full text-left p-2 rounded focus:outline-none ${subTitleFont.className} duration-500 transition-all antialiased font-bold`,
        {
            'bg-gray-700 text-white': isOpen,
        }
      )}>
        {title}
      </button>

      <div
        className={clsx('transition-all max-h-0 overflow-hidden duration-500 my-1 mx-2', {
          'max-h-96': isOpen,
        })}
      >
        {/* Contenido del menú desplegable */}
        {children}
      </div>
    </div>
  )
}
