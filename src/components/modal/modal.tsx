import clsx from 'clsx'
import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode
    showModal: boolean
    setShowModal: (show: boolean) => void
}

export const Modal = ({children, showModal, setShowModal}: Props) => {

  return (
    <>
      <div
        className={clsx(
          'justify-center transition-all items-center w-full flex overflow-x-hidden overflow-y-auto absolute top-0 h-screen left-0 z-50 focus:outline-none',
          {
            'translate-x-full': !showModal,
            'translate-x-0': showModal,
          }
        )}
      >
        <div
          onClick={() => setShowModal(false)}
          className={clsx(
            'w-full backdrop-filter backdrop-blur-sm transition-all fade-in bg-black left-0 bg-opacity-5 absolute top-0 h-screen',
            {
              ' bg-opacity-20': showModal,
              ' bg-opacity-0': !showModal,
            }
          )}
        ></div>
        <div className={clsx('justify-center items-center  flex overflow-x-hidden overflow-y-auto focus:outline-none')}>
          <div className='relative w-auto my-6 mx-auto max-w-3xl'>
            {/*content*/}
            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
              {/*header*/}
              <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
                <h3 className='text-3xl font-semibold'>Modal Title</h3>
                <button
                  className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                  onClick={() => setShowModal(false)}
                >
                  <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className='relative p-6 flex-auto'>
                {children}
              </div>
              {/*footer*/}
              <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
                <button
                  className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => setShowModal(false)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
