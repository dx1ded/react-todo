import {useContext} from "react"
import {DatabaseContext} from "../context/databaseContext"

export const useDB = () => {
  const db = useContext(DatabaseContext)

  return db
}
