import {useState, useEffect} from "react"
import {onAuthStateChanged} from "firebase/auth"
import {doc, getDoc} from "firebase/firestore/lite"
import {useAuth} from "../../hooks/useAuth"
import {useDB} from "../../hooks/useDB"
import {isObjectEmpty} from "../../utils"
import {Photo} from "./Photo"
import {Action} from "./Action"
import {Loader} from "../../components/Loader/Loader"
import "./Account.scss"

export const Account = () => {
  const auth = useAuth()
  const db = useDB()
  const [user, setUser] = useState({})

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user) return

      try {
        const snapshot = await getDoc(doc(db, "users", user.email))
        setUser(snapshot.data())
      } catch (e) {
        console.error(e)
      }
    })

    return listen
  }, [auth, db])

  if (isObjectEmpty(user)) {
    return <Loader />
  }

  return (
    <section className="account">
      <Photo user={user} setUser={setUser} db={db} />
      <div className="user">
        <h2 className="title--lg user__name">{user.fullName}</h2>
        <h5 className="text--sm user__nickname">@{user.username}</h5>

        <div className="account__actions">
          <Action
            name="Change name"
            isInput={true}
            type="primary" />
          <Action
            name="Change password"
            isInput={true}
            type="secondary" />
          <Action
            name="Quit"
            type="danger" />
        </div>
      </div>
    </section>
  )
}
