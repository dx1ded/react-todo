import {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import {onAuthStateChanged} from "firebase/auth"
import {getUserDoc} from "../../getUserDoc"
import {useAuth} from "../../hooks/useAuth"
import {useDB} from "../../hooks/useDB"
import {useSaveDebounced} from "../../hooks/useSaveDebounced"
import {Loader} from "../../components/Loader/Loader"
import "./Todo.scss"

const Task = ({ name, isDone, index, list, setList }) => {
  const toggleDone = () => {
    setList({
      ...list,
      tasks: list.tasks.map(
        (task, i) => i === index
          ? { ...list.tasks[index], done: !list.tasks[index].done }
          : task
      )
    })
  }

  const deleteTask = () => {
    setList({
      ...list,
      tasks: list.tasks.filter((_, i) => i !== index)
    })
  }

  return (
    <li className={`task ${isDone ? "task--done" : ""}`}>
      <div className="task__left">
        <button className="btn btn-reset task__done" aria-label="Mark as done" onClick={toggleDone}>
          <span className="material-symbols-outlined">
            {isDone ? "check_circle" : "radio_button_unchecked"}
          </span>
        </button>
        <h5 className="task__name">{name}</h5>
      </div>
      <div className="task__right">
        <button className="btn btn-reset task__edit" aria-label="Edit task">
          <span className="material-symbols-outlined">edit_note</span>
        </button>
        <button className="btn btn-reset task__delete" aria-label="Delete task" onClick={deleteTask}>
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </li>
  )
}

export const Todo = () => {
  const auth = useAuth()
  const db = useDB()
  const { id } = useParams()
  const [doc, setDoc] = useState({})
  const [list, setList] = useState({})
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) return

      try {
        const doc = await getUserDoc(db, user.email)

        setDoc(doc)
        setList(doc.data().list
          .find((list) => list.id === id)
        )
        setIsLoading(false)
      } catch (e) {
        console.error(e)
      }
    })

    return listen
  }, [auth, db, id])

  if (isLoading) {
    return <Loader />
  }

  const completedTasks = list.tasks.reduce((acc, task) => {
    return task.done ? acc + 1 : acc
  }, 0)

  const addTask = () => {
    setList({
      ...list,
      tasks: [
        ...list.tasks,
        {
          name: inputValue,
          done: false
        }
      ]
    })
  }

  return (
    <section className="todo">
      <div className="todo__header">
        <input type="text" className="todo__name" defaultValue={list.name} />
      </div>
      <div className="todo__body">
        <div className="todo__add">
          <input
            type="text"
            placeholder="Task name"
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button
            className="btn btn-reset"
            onClick={addTask}>
            Add
          </button>
        </div>
        <div className="todo__labels">
          <h4 className="todo__label" style={{color: "var(--color-blue)"}}>
            Total amount
            <span>{list.tasks.length}</span>
          </h4>
          <h4 className="todo__label" style={{color: "var(--color-purple)"}}>
            Completed
            <span>{completedTasks} of {list.tasks.length}</span>
          </h4>
        </div>
        <ul className="list-reset tasks">
          {list.tasks.map((task, i) =>
            <Task
              key={i}
              index={i}
              name={task.name}
              isDone={task.done}
              list={list}
              setList={setList}
            />
          )}
        </ul>
      </div>
    </section>
  )
}
