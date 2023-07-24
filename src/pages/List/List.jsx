import {useState} from "react"
import {NavLink} from "react-router-dom"
import {v4} from "uuid"
import {updateDoc} from "firebase/firestore"
import {useUser} from "@hooks/useUser"
import {Loader} from "@components/Loader/Loader"
import {isObjectEmpty} from "@/utils"
import "./List.scss"

const ListItem = ({ item }) => {
  const dateString = new Date(item.date_modified).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  })

  return (
    <NavLink to={`/list/${item.id}`} className="list-item">
      <span className="list-item__name">{item.name}</span>
      <time className="list-item__date">{dateString}</time>
    </NavLink>
  )
}

export const List = () => {
  const [todos, setTodos] = useState({})
  const [user, loading, doc] = useUser()

  const addList = async () => {
    const id = v4()

    const newState = {
      ...user.todos,
      [id]: {
        id,
        name: "New List",
        date_modified: Date.now(),
        tasks: []
      }
    }

    setTodos(newState)
    await updateDoc(doc.ref, { "todos": newState })
  }

  if (loading) {
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
          {Object.values(isObjectEmpty(todos) ? user.todos : todos)
            .sort((a, b) => b.date_modified - a.date_modified)
            .map((item) => <ListItem key={item.id} item={item} />)
          }
          <button className="btn btn-reset list__add" onClick={addList}>Add list</button>
        </div>
      </div>
    </section>
  )
}
