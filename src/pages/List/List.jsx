import {useState, useEffect} from "react"
import {NavLink} from "react-router-dom"
import {v4} from "uuid"
import {onAuthStateChanged} from "firebase/auth"
import {updateDoc} from "firebase/firestore/lite"
import {getUserDoc} from "../../getUserDoc"
import {useAuth} from "../../hooks/useAuth"
import {useDB} from "../../hooks/useDB"
import {Loader} from "../../components/Loader/Loader"
import "./List.scss"

const ListItem = ({ id, name, dateModified }) => {
  const dateString = new Date(dateModified).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  })

  return (
    <NavLink to={"/list/" + id} className="list-item">
      <span className="list-item__name">{name}</span>
      <time className="list-item__date">{dateString}</time>
    </NavLink>
  )
}

export const List = () => {
  const auth = useAuth()
  const db = useDB()
  const [doc, setDoc] = useState({})
  const [list, setList] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  // const [saveData, contextHolder] = useSaveDebounced(doc.ref, "todos")

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) return

      try {
        const doc = await getUserDoc(db, user.email)

        setDoc(doc)
        setList(doc.data().todos)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
      }
    })

    return listen
  }, [auth, db])

  const addList = async () => {
    const id = v4()

    const newState = {
      ...list,
      [id]: {
        id,
        name: "New List",
        date_modified: Date.now(),
        tasks: []
      }
    }

    setList(newState)
    await updateDoc(doc.ref, { "todos": newState })
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className="list">
      <h2 className="title--lg list__title">List</h2>
      <div className="list__container">
        <div className="list__labels">
          <h4 className="list__label">Name</h4>
          <h4 className="list__label">Date modified</h4>
        </div>
        <div className="list__items">
          {Object.values(list)
            .sort((a, b) => b.date_modified - a.date_modified)
            .map((item) => (
              <ListItem
                id={item.id}
                key={item.id}
                name={item.name}
                dateModified={item.date_modified}
              />
            )
          )}
          <button className="btn btn-reset list__add" onClick={addList}>Add list</button>
        </div>
      </div>
    </section>
  )
}
