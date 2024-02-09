import { titleFont } from '@/config/fonts';
import React from 'react'

interface Props {
    title: string;
    className?: string;
}


export const Title = ({title, className}:Props) => {
  return (
    <div className={`mt-3 ${ className}`}>
        <h3 className={`${titleFont.className} antialiased text-2xl font-semibold mt-5`}>
            { title }
        </h3>
    </div>
  )
}
