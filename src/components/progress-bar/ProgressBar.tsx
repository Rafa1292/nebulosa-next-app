'use client'

import { useEffect, useState } from "react"

interface Props {
    progressStep: number
    callback?: () => void
    condition: boolean
}

export const ProgressBar = ({ progressStep, callback, condition }:Props) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let progress = 0
        const interval = setInterval(() => {
            progress += progressStep
            setProgress(progress)
            if (progress >= 100 && condition) {
                clearInterval(interval)
                if (callback) {
                    callback()
                }
            }
        }, 10)
    }, [condition])



  return (
    <div className='w-full px-2 transition-all flex items-center justify-left'>
        <div
        style={{width: `${progress}%`}}
        className={`h-4 rounded-full bg-red-800`}        
        ></div>
    </div>
  )
}
