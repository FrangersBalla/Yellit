import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Outlet } from "react-router-dom"

export default function ProtectedRouter() {
  const { currentUser } = useAuth()
  const { loading } = useAuth()

  if (!currentUser && !loading) { //solo se non sono loggato
    return <Navigate to="/login" replace />
  }

  return <Outlet/>
}
