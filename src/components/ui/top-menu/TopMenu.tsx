'use client'

import { titleFont } from '@/config/fonts'
import { useUIStore } from '@/store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { RiMenu3Line } from "react-icons/ri";

export const TopMenu = () => {
  const toggleMenu = useUIStore((state) => state.toggleMenu)
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLoader(true)
  }, [])

  return (
    <nav className='flex px-5 justify-between items-center w-full'>
      {/* logo */}
      <div>
        <Link href={'/'}>
          <span className={`${titleFont.className} antialiased font-bold`}>Nebulosa</span>
          <span> | Admin</span>
        </Link>
      </div>

      {/* center menu */}

      <div className='hidden sm:block'>
      </div>

      {/* search, cart, menu */}

      <div className='flex items-center'>
        {/* <Link href={'/search'} className='mx-2'>
          <IoSearchOutline className='w-5 h-5'></IoSearchOutline>
        </Link> */}

        <button onClick={toggleMenu} className={`${titleFont.className} 
        flex antialiased font-bold m-2 p-2 rounded-md transition-all items-center gap-1
        hover:bg-gray-900 
        hover:text-white 
        hover:drop-shadow-2xl`}>
        <RiMenu3Line />
          Menu
        </button>
      </div>
    </nav>
  )
}
