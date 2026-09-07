import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStore } from '@/context/StoreContext'

export function CustomerRoute({ children }: { children: ReactNode }) {
  const { user } = useStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />
  }
  return <>{children}</>
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useStore()
  const location = useLocation()

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
