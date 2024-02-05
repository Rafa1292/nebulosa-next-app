import { titleFont } from '@/config/fonts';
import React from 'react'

interface Props {
    title: string;
    className?: string;
}


export const Title = ({title, className}:Props) => {
  return (
    <div className={`mt-3 ${ className}`}>
        <h1 className={`${titleFont.className} antialiased text-4xl font-semibold mt-5`}>
            { title }
        </h1>
    </div>
  )
}
