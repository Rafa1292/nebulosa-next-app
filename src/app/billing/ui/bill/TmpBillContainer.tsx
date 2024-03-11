'use client'

import { useState } from "react"
import { Bill } from "./Bill"
import { Menu, SaleItemCategory } from "@/interfaces"

interface Props {
    saleItemCategories: SaleItemCategory[]
    menus: Menu[]
}

export const TmpBillContainer = ({saleItemCategories, menus}:Props) => {
    const [show, setShow] = useState(false)

    return (
        <>
        <button className="text-white font-bold py-2 px-4  rounded bg-blue-600 hover:bg-blue-500 cursor-pointer" onClick={() => setShow(!show)}>Show</button>
        <Bill menus={menus} saleItemCategories={saleItemCategories} show={show} setShow={setShow}/>
        </>
    )

}