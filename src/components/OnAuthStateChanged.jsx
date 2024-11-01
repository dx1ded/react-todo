import {useEffect} from "react";
import {getAuth} from "firebase/auth"
import {useAuthContext, defaultUser} from "@/context/authContext"

export function OnAuthStateChanged({ children }) {
  const { setUser, setIsLoading } = useAuthContext()

  useEffect(() => {
    return getAuth().onIdTokenChanged((user) => {
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
  }, [setIsLoading, setUser])

  return children
}
