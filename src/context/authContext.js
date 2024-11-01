import {createContext, useContext, useMemo, useState} from "react"

export const defaultUser = {
  id: "",
  email: "",
  displayName: "",
  photoURL: ""
}

const initialState = {
  isLoading: true,
  setIsLoading: () => {},
  user: defaultUser,
  setUser: () => {}
}

export const AuthContext = createContext(initialState)

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(defaultUser)

  const defaultValue = useMemo(() => ({
    isLoading,
    setIsLoading,
    user,
    setUser
  }), [isLoading, user])

  return (
    <AuthContext.Provider value={defaultValue}>{children}</AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
