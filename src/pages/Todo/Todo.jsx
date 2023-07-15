import {useState, useEffect, useRef} from "react"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {useParams} from "react-router-dom"
import {v4} from "uuid"
import {onAuthStateChanged} from "firebase/auth"
import {getUserDoc} from "../../getUserDoc"
import {useAuth} from "../../hooks/useAuth"
import {useDB} from "../../hooks/useDB"
import {useSaveDebounced} from "../../hooks/useSaveDebounced"
import {Task} from "./Task"
import {Loader} from "../../components/Loader/Loader"
import "./Todo.scss"

export const Todo = () => {
  const auth = useAuth()
  const db = useDB()
  const { id } = useParams()
  const [doc, setDoc] = useState({})
  const [list, setList] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef(null)

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

  const completedTasks = list.tasks.reduce(
    (acc, task) => task.done ? acc + 1 : acc, 0
  )

  const addTask = () => {
    setList({
      ...list,
      tasks: [
        ...list.tasks,
        {
          id: v4(),
          name: inputRef.current.value,
          done: false
        }
      ]
    })

    inputRef.current.value = ""
  }

  const handleDragDrop = (results) => {
    const { source, destination } = results

    if (!destination || source.index === destination.index) return

    const [
      { index: sIndex },
      { index: dIndex }
    ] = [source, destination]

    const filteredCol = list.tasks.filter((_, i) => i !== sIndex)

    const newState = {
      ...list,
      tasks: [
        ...filteredCol.slice(0, dIndex),
        list.tasks[sIndex],
        ...filteredCol.slice(dIndex)
      ]
    }

    setList(newState)
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
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            ref={inputRef}
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
        <DragDropContext onDragEnd={handleDragDrop}>
          <Droppable droppableId="list" type="group">
            {(provided) => (
              <ul className="list-reset tasks" {...provided.droppableProps} ref={provided.innerRef}>
                {list.tasks.map((task, i) =>
                  <Draggable draggableId={`list/${task.id}`} key={task.id} index={i} isDragDisabled={task.done}>
                    {(provided) => (
                      <Task
                        index={i}
                        name={task.name}
                        isDone={task.done}
                        list={list}
                        setList={setList}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </section>
  )
}
