import { titleFont } from '@/config/fonts'
import React from 'react'

export const BillItemHeader = () => {
  return (
    <div className='flex border-b-gray-600 h-[5vh] flex-wrap text-black cursor-pointer select-none items-center px-3 border-b-2'>
    <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>Nombre</div>
    <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>Desc</div>
    <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>Cant</div>
    <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>P/U</div>
    <div className={`${titleFont.className}  antialiased text-center w-1/6 text-xs font-bold`}>Total</div>
  </div>  )
}
