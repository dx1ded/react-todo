import {useContext, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {onAuthStateChanged} from "firebase/auth"
import {FirebaseContext} from "../context/firebaseContext"

export const useAuth = () => {
  const auth = useContext(FirebaseContext)
  const navigate = useNavigate()

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (!user && window.location.pathname !== "/auth") {
        navigate("/auth")
      } else if (user && window.location.pathname === "/auth") {
        navigate("/")
      }
    })

    return listen
  }, [auth, navigate])

  return auth
}
