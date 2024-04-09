import clsx from 'clsx'
import React from 'react'

interface Props {
    show: boolean
}

export const BillPayMethod = ({show}:Props) => {
  return (
    <div
    className={clsx('absolute h-screen w-3/5 transition-all bg-black translate-y-full bottom-0 z-20 left-0', {
      '!translate-y-0': show,
    })}
  ></div>
  )
}
