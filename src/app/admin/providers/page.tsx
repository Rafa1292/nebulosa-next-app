import { TableList } from '@/components/view-data/table/TableList'

export default async function ProvidersPage() {
  return (
    <>
      <TableList
        tableTitle='Proveedores'
        buttonTitle='Agregar Proveedor'
        buttonRef='/admin/providers/add'
        heads={['Nombre', 'Correo', 'Teléfono']}      
      >
        <tr className='bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100'>
          <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap'>Proveedor 1</td>
          <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap'>correo</td>
          <td className='text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap'>teléfono</td>
        </tr>
      </TableList>
    </>
  )
}
