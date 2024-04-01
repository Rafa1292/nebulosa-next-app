'use client'

import { useEffect, useState } from "react"

interface Props {
    progress: number
}

export const ProgressBar = ({ progress }:Props) => {

  return (
    <div className='w-full px-2 h-full transition-all flex items-center justify-left'>
        <div
        style={{width: `${progress}%`}}
        className={`h-4 rounded-full bg-red-800`}        
        ></div>
    </div>
  )
}
