import {collection, getDocs, query, where} from "firebase/firestore/lite"

export async function getUserDocBy(db, field, value) {
  const q = await query(collection(db, "users"), where(
    field,
    "==",
    value
  ))

  return getDocs(q)
    .then((snapshot) => {
      if (!snapshot.empty) {
        return snapshot.docs[0]
      }
    })
}
