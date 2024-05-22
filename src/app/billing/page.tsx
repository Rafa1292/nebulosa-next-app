import { getMenus, getSaleItemCategoriesWithRelations, getWorkDayByEmail } from '@/actions'
import { auth } from '@/auth.config'
import { redirect } from 'next/navigation'
import { WorkDay } from './ui/WorkDay'
import { TmpBillContainer } from './ui/bill/TmpBillContainer'
import { Room } from './ui/room/Room'

export default async function BillingPage() {
  const session = await auth()
  const allowedUserRoles = ['user', 'admin']
  const { saleItemCategories } = await getSaleItemCategoriesWithRelations()
  const { menus } = await getMenus()

  if (!session) {
    redirect('/auth/login')
  }

  if (!session.user) {
    return <div className='items-center w-full mt-10 justify-center flex'>Usuario invalido</div>
  }

  if (allowedUserRoles.indexOf(session.user.role) === -1) {
    return (
      <div className='items-center w-full mt-10 justify-center flex'>
        No tienes los permisos para acceder a esta seccion
      </div>
    )
  }

  const { ok, workDay } = await getWorkDayByEmail(session.user.email)

  if (!ok) {
    return <WorkDay userId={session.user.id} />
  }

  return (
    <div className='w-full wrap h-screen'>
      <Room menus={menus ?? []} saleItemCategories={saleItemCategories ?? []}/>
    </div>
  )
}
