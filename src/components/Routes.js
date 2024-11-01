import {Outlet, Navigate, useLocation} from "react-router-dom"
import {Loader} from "@/components/Loader/Loader"
import {useAuthContext} from "@/context/authContext"

export const PrivateRoutes = () => {
  const { user, isLoading } = useAuthContext()

  if (isLoading) return <Loader />

  return user.id
    ? <Outlet />
    : <Navigate to="/auth" />
}


export const PublicRoutes = () => {
  const { user, isLoading } = useAuthContext()
  const location = useLocation()

  if (isLoading) return <Loader />

  return user.id && location.pathname === "/auth"
    ? <Navigate to="/" />
    : <Outlet />
}
