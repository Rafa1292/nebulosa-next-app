import React from 'react'
import { Menu } from '@/interfaces'
import clsx from 'clsx'
import { titleFont } from '@/config/fonts'
import { useMenuStore } from '@/store/menu/menu-store'


export const MenuSelection = () => {
  const { menus, setSaleItemCategoriesWithPriceFromMenu } = useMenuStore()

  const [selectedMenu, setSelectedMenu] = React.useState<Menu | null>(null)

  const handleChangeMenu = (menu: Menu) => {
    setSelectedMenu(menu)
    setSaleItemCategoriesWithPriceFromMenu(menu)
  }

  return (
    <div className='w-full flex gap-3 px-2 border-b-2 justify-center py-2'>
      {menus.map((menu, index) => (
        <div
          onClick={() => handleChangeMenu(menu)}
          key={index}
          className={clsx(
            'flex bg-red-800 text-white cursor-pointer select-none hover:bg-white hover:border-gray-900 hover:!text-black justify-between px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
            {
              'bg-white border-gray-900 !text-black': selectedMenu?.id === menu.id,
            }
          )}
        >
          <div className={`${titleFont.className}  antialiased text-xs font-bold`}>{menu.name}</div>
        </div>
      ))}
    </div>
  )
}
