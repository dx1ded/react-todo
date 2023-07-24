import {useContext} from "react"
import {getFirestore, collection, query, where} from "firebase/firestore"
import {useCollectionOnce} from "react-firebase-hooks/firestore"
import {FirebaseContext} from "@/context/firebaseContext"

export const useUser = () => {
  const {auth} = useContext(FirebaseContext)
  const [snapshot, loading] = useCollectionOnce(
    query(
      collection(getFirestore(), "users"),
      where(
        "email",
        "==",
        auth.currentUser.email
      )
    )
  )

  if (loading) return [{}, true, {}]

  const doc = snapshot.docs[0]

  // [user, loading, doc?]
  return [doc.data(), loading, doc]
}
