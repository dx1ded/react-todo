import {useEffect, useState} from "react"
import {NavLink} from "react-router-dom"
import {nanoid} from "nanoid"
import dayjs from "dayjs"
import {
  doc,
  setDoc,
  getDocs,
  query,
  getFirestore,
  collection,
  where
} from "firebase/firestore"
import {Loader} from "@/components/Loader/Loader"
import {useAuthContext} from "@/context/authContext"
import "./List.scss"

export const List = () => {
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    if (!user.id) return

    async function fetchTodos() {
      const snapshot = await getDocs(query(
        collection(getFirestore(), "todos"),
        where("userId", "==", user.id)
      ))

      if (!snapshot.empty) {
        const state = []

        snapshot.forEach((doc) => {
          state.push(doc.data())
        })

        setTodos(state)
      }

      setLoading(false)
    }

    fetchTodos()
  }, [user.id])

  const addList = async () => {
    const id = nanoid()

    const newList = {
      id,
      userId: user.id,
      name: "New List",
      lastUpdated: Date.now(),
      tasks: []
    }

    setTodos((prev) => [newList, ...prev])
    await setDoc(doc(getFirestore(), "todos", id), newList)
  }

  if (loading) return <Loader />

  return (
    <section className="list">
      <h2 className="title--lg list__title">List</h2>
      <div className="list__container">
        <div className="list__labels">
          <h4 className="list__label">Name</h4>
          <h4 className="list__label">Date modified</h4>
        </div>
        <div className="list__items">
          {todos
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((item) => <ListItem key={item.id} item={item} />)
          }
          <button className="btn btn-reset list__add" onClick={addList}>Add list</button>
        </div>
      </div>
    </section>
  )
}

const ListItem = ({ item }) => {
  return (
    <NavLink to={`/list/${item.id}`} className="list-item">
      <span className="list-item__name">{item.name}</span>
      <time className="list-item__date">{dayjs(item.lastUpdated).format("M/D/YYYY")}</time>
    </NavLink>
  )
}
