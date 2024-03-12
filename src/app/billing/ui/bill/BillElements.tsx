import { QuantitySelector } from "@/components"
import { titleFont } from "@/config/fonts"
import { ArticleModifierGroup, ModifierGroup } from "@/interfaces"
import clsx from "clsx"


interface Props {
    articleModifierGroup: ArticleModifierGroup | undefined
}

export const BillElements = ({ articleModifierGroup }: Props) => {
 return (
    <div className='w-full flex flex-wrap gap-3 px-2 justify-center py-4'>
    <div className={`${titleFont.className}  antialiased text-center text-xs w-full font-bold my-2`}>
      Elementos
    </div>
    {articleModifierGroup?.modifierGroup?.elements?.map((element, index) => (
      <div
        // onClick={() => setSelectedModifierGroup(articleModifier?.modifierGroup)}
        key={index}
        className={clsx(
          'flex bg-black text-white flex-wrap cursor-pointer h-16 w-1/5 items-center select-none justify-center px-3 py-1 border-y-2 shadow-xl rounded-xl border-white',
          ' hover:bg-white hover:border-gray-900 hover:!text-black',
          {
            // '!border-y-2 border-gray-900': selectedModifierGroup?.id === element.modifierGroupId
          }
        )}
      >
        <div className={`${titleFont.className} w-full px antialiased text-center text-xs font-bold`}>{element.name}</div>
          <QuantitySelector 
          minusClassName="hover:bg-black p-0.5 hover:!text-white rounded-2xl"
          plusClassName="hover:bg-black p-0.5 hover:!text-white rounded-2xl"
          quantity={0} 
          setQuantity={(quantity: number) => {}} 
          />
      </div>
    ))}
  </div>
 )

}

