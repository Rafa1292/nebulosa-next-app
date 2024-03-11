import { titleFont } from '@/config/fonts'
import { SaleItem } from '@/interfaces'
import clsx from 'clsx'
import { IoCloseCircleOutline } from 'react-icons/io5'

interface Props {
  saleItem: SaleItem | null
  setSaleItem: (saleItem: SaleItem | null) => void
}

export const BillArticles = ({ saleItem, setSaleItem }: Props) => {
  return (
    <div
      className={clsx('absolute h-screen w-3/5 transition-all translate-y-full bottom-0 z-20 left-0', {
        'translate-y-0': saleItem !== null,
      })}
    >
      <div
        onClick={() => setSaleItem(null)}
        className={clsx(
          'w-full backdrop-filter cursor-not-allowed delay-100 duration-500 transition-all backdrop-blur-md z-10 bg-black opacity-0 h-1/4',
          {
            'opacity-40': saleItem !== null,
          }
        )}
      ></div>
      <div className={clsx('h-3/4 w-full bg-white z-20 relative', {})}>
        <IoCloseCircleOutline
          onClick={() => setSaleItem(null)}
          className='cursor-pointer z-50 text-4xl absolute text-red-800 right-3 top-3 hover:text-red-700'
        />
        <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2'>
          {saleItem?.saleItemArticles?.map((itemArticle, index) => (
            <div
              key={index}
              className='flex bg-red-800 w-1/5 justify-center text-white h-16 items-center cursor-pointer select-none hover:bg-white hover:border-gray-900 hover:!text-black px-3 py-1 border-y-2 shadow-xl rounded-xl border-white'
            >
              <div className={`${titleFont.className}  antialiased text-center text-xs font-bold`}>{itemArticle.article?.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
