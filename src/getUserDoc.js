import {collection, getDocs, query, where} from "firebase/firestore/lite"

export const getUserDoc = async (db, email) => {
  const q = await query(collection(db, "users"), where(
    "email",
    "==",
    email
  ))

  return getDocs(q)
    .then((snapshot) => {
      if (!snapshot.empty) {
        return snapshot.docs[0]
      }
    })
}
