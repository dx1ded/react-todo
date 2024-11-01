import {useEffect, useMemo} from "react"
import {getAuth} from "firebase/auth"
import {useAuthContext, defaultUser} from "@/context/authContext"

export function OnAuthStateChanged({ children }) {
  const { setUser, setIsLoading } = useAuthContext()
  const auth = useMemo(() => getAuth(), [])

  useEffect(() => {
    return auth.onIdTokenChanged((user) => {
      if (!user) {
        setUser(defaultUser)
        return setIsLoading(false)
      }

      setUser({
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
      setIsLoading(false)
    })
  }, [auth, setIsLoading, setUser])

  return children
}
