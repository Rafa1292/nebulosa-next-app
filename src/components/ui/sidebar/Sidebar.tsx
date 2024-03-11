'use client'

import { subTitleFont, titleFont } from '@/config/fonts'
import { useUIStore } from '@/store'
import clsx from 'clsx'
import Link from 'next/link'
import {
  IoCloseCircleOutline ,
  IoSearchOutline,
} from 'react-icons/io5'
import { Dropdown } from '@/components'

export const Sidebar = () => {
  const isMenuOpen = useUIStore((state) => state.isMenuOpen)
  const toggleMenu = useUIStore((state) => state.toggleMenu)

  return (
    <div>
      {isMenuOpen && (
        <>
          <div className='fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30'></div>
          <div
            className='fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm'
            onClick={toggleMenu}
          ></div>
        </>
      )}
      <nav
        className={clsx(
          'fixed p-5 right-0 top-0 w-full sm:w-[500px] h-screen bg-white z-20 shadow-2xl fade-in transform transition-all duration-300',
          {
            'translate-x-full': !isMenuOpen,
          }
        )}
      >
        <IoCloseCircleOutline  className='absolute top-5 right-5 text-4xl cursor-pointer hover:bg-gray-900 hover:text-white rounded-3xl transition-all' onClick={() => toggleMenu()} />
        <div className='relative my-10'>
          <IoSearchOutline size={20} className='absolute top-3 left-2 text-gray-300' />
          <input
            type='text'
            placeholder='Buscar'
            className='w-full bg-gray-50 rounded pl-10 py-2 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500'
          />
        </div>
        <Link
            href={'/billing'}
            onClick={() => toggleMenu()}
            className={` w-full text-left p-2 rounded focus:outline-none ${subTitleFont.className} duration-500 transition-all antialiased font-bold`}
          >
            Jornadas
          </Link>
        <Dropdown title='Mantenimiento'>
          <Link
            href={'/admin/work-days'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Jornadas
          </Link>
          <Link
            href={'/admin/budgets'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Presupuestos
          </Link>
          <Link
            href={'/admin/brands'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Marcas
          </Link>
          <Link
            href={'/admin/input-categories'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Categorias de insumo
          </Link>
          <Link
            href={'/admin/inputs'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Insumos
          </Link>
          <Link
            href={'/admin/preparations'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Preparaciones
          </Link>
          <Link
            href={'/admin/sale-item-categories'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Categorias de venta
          </Link>
          <Link
            href={'/admin/providers'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Proveedores
          </Link>
          <Link
            href={'/admin/articles'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Articulos
          </Link>
          <Link
            href={'/admin/modifier-groups'}
            onClick={() => toggleMenu()}
            className={`flex items-center p-2 hover:bg-gray-100 rounded transition-all cursor-pointer ${titleFont.className} antialiased`}
          >
            Modificadores
          </Link>
        </Dropdown>

        <div className='w-full h-px bg-gray-200 my-10'></div>
      </nav>
    </div>
  )
}
