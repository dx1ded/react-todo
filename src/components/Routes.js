import {Outlet, Navigate, useLocation} from "react-router-dom"
import {useAuth} from "@hooks/useAuth"
import {Loader} from "@components/Loader/Loader"

export const PrivateRoutes = () => {
  const [user, loading] = useAuth()

  if (loading) return <Loader />

  return user
    ? <Outlet />
    : <Navigate to="/auth" />
}


export const PublicRoutes = () => {
  const [user] = useAuth()
  const location = useLocation()

  return user && location.pathname === "/auth"
    ? <Navigate to="/" />
    : <Outlet />
}
