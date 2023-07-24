import {useContext} from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import {FirebaseContext} from "@/context/firebaseContext"

export const useAuth = () => {
  const context = useContext(FirebaseContext)
  const [user, authLoading] = useAuthState(context.auth)

  return [user, authLoading]
}
