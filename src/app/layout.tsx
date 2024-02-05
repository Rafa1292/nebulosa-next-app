import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components'
import { TopMenu } from '@/components/ui/top-menu/TopMenu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nebulosa | Admin',
  description: 'Retail management for the modern age',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es'>
      <body className={`${inter.className} min-h-screen px-2`}>
        <TopMenu />
        <Sidebar />
        {children}
      </body>
    </html>
  )
}
