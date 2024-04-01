'use client'

import { ProgressBar } from '@/components'
import { useBillStore } from '@/store'
import { useState } from 'react'
import { LuConciergeBell } from 'react-icons/lu'

export const BillActions = () => {
    const { bill } = useBillStore()
    const [comandActionWait, setComandActionWait] = useState(false)
    const [progress, setProgress] = useState(0)
    const progressStep = (100 / 10) / 2
    
  return (
    <>
    {
        bill.id === '' ? (
            <div className='w-full h-full items-center flex justify-center'>
                <ProgressBar progress={5}/> 
            </div>
        ):(
            <div className='w-full text-8xl hover:text-9xl  rounded-t-lg h-full items-center flex justify-center bg-green-800 text-white hover:bg-green-700 cursor-pointer'>
            <LuConciergeBell />

            </div>
        )
    }
    </>
  )
}
