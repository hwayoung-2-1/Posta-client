'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

const AUTH_PATHS = ['/login', '/signup']

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isAuth = AUTH_PATHS.includes(pathname)

  if (isAuth) {
    return <>{children}</>
  }

  return (
    <>
      <Sidebar />
      <div className='ml-20 h-screen overflow-y-auto'>
        {children}
      </div>
    </>
  )
}
