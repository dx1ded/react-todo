import {useState, useEffect, useRef} from "react"
import {DragDropContext, Droppable, Draggable} from "@hello-pangea/dnd"
import {useParams, useNavigate} from "react-router-dom"
import {useDebouncedCallback} from "use-debounce"
import {nanoid} from "nanoid"
import {
  updateDoc,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
  collection
} from "firebase/firestore"
import {handleEnter} from "@/utils"
import {useNotification} from "@/components/Notification/useNotification"
import {useAuthContext} from "@/context/authContext"
import {Loader} from "@/components/Loader/Loader"
import {Task} from "./Task"
import "./Todo.scss"

const DEBOUNCED_SAVE_TIME = 1500

export const Todo = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [todo, setTodo] = useState({})
  const [todoDoc, setTodoDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [api, contextHolder] = useNotification()
  const inputRef = useRef(null)

  useEffect(() => {
    if (!id || !user.id) return

    async function fetchTodo() {
      const snapshot = await getDocs(query(
        collection(getFirestore(), "todos"),
        where("id", "==", id),
        where("userId", "==", user.id),
      ))

      if (!snapshot.empty) {
        const doc = snapshot.docs[0]

        setTodoDoc(doc)
        setTodo(doc.data())
      }

      setLoading(false)
    }

    fetchTodo()
  }, [id, user.id])

  const saveTodoDebounced = useDebouncedCallback(async () => {
    if (!todoDoc) return

    try {
      await updateDoc(todoDoc.ref, todo)
      api.add({
        title: "👍 Saved",
        text: "Your data has been saved successfully!",
        duration: 5000
      })
    } catch (_) {
      api.add({
        title: "😔 Unknown error",
        text: "Please, try again!",
        duration: 5000
      })
    }
  }, DEBOUNCED_SAVE_TIME)

  // Saving on exit
  useEffect(() => saveTodoDebounced.flush, [saveTodoDebounced.flush])

  const changeName = (name) => {
    setTodo((prev) => ({ ...prev, name, lastUpdated: Date.now() }))
    saveTodoDebounced()
  }

  const deleteTodo = () => {
    if (!todoDoc) return

    const confirm = async () => {
      await deleteDoc(todoDoc.ref)
      navigate("/list")
    }

    api.add({
      title: "🗑️ Do you want to delete?",
      text: "If you really want to delete the todo-list, then confirm by clicking the button below",
      children: (
        <div className="notification__container">
          <button
            className="notification__button"
            onClick={confirm}>
            Delete
          </button>
        </div>
      )
    })
  }

  const addTask = () => {
    const name = inputRef.current.value

    if (!name) {
      return api.add({
        title: "😶 Cannot be empty!",
        text: "The name of the task cannot be empty. Please enter any letters!",
        duration: 5000
      })
    }

    setTodo((prev) => ({
      ...prev,
      lastUpdated: Date.now(),
      tasks: [
        {
          id: nanoid(),
          name,
          done: false
        },
        ...prev.tasks
      ]
    }))
    saveTodoDebounced()

    inputRef.current.value = ""
  }

  const handleDragDrop = (results) => {
    const { source, destination } = results

    if (!destination || source.index === destination.index) return

    const [
      { index: sIndex },
      { index: dIndex }
    ] = [source, destination]

    const target = todo.tasks.find((_, i) => i === sIndex)
    const updatedTasks = [...todo.tasks]

    updatedTasks.splice(sIndex, 1)
    updatedTasks.splice(dIndex, 0, target)

    setTodo((prev) => ({ ...prev, tasks: updatedTasks, lastUpdated: Date.now() }))
    saveTodoDebounced()
  }

  if (loading) {
    return <Loader />
  }

  if (!loading && !todo.id) {
    return <h2 className="title--md not-found">Not found</h2>
  }

  const completedTasks = todo.tasks.reduce(
    (acc, task) => task.done ? acc + 1 : acc, 0
  )

  return (
    <section className="todo">
      {contextHolder}
      <div className="todo__header">
        <input
          type="text"
          className="todo__name"
          defaultValue={todo.name}
          onChange={(e) => changeName(e.target.value)}
        />
        <button className="btn btn-reset todo__delete" onClick={() => void deleteTodo()}>
          Delete
        </button>
      </div>
      <div className="todo__body">
        <div className="todo__add">
          <input
            ref={inputRef}
            type="text"
            placeholder="Task name"
            onKeyDown={handleEnter(addTask)}
          />
          <button
            className="btn btn-reset"
            onClick={() => void addTask()}>
            Add
          </button>
        </div>
        <div className="todo__labels">
          <h4 className="todo__label" style={{ color: "var(--color-blue)" }}>
            Total amount
            <span>{todo.tasks.length}</span>
          </h4>
          <h4 className="todo__label" style={{ color: "var(--color-purple)" }}>
            Completed
            <span>{completedTasks} of {todo.tasks.length}</span>
          </h4>
        </div>
        <DragDropContext onDragEnd={handleDragDrop}>
          <Droppable droppableId="tasks" type="group">
            {(provided) => (
              <ul className="list-reset tasks" {...provided.droppableProps} ref={provided.innerRef}>
                {todo.tasks.map((task, i) =>
                  <Draggable key={task.id} draggableId={task.id} index={i} isDragDisabled={task.done}>
                    {(provided) => (
                      <Task
                        task={task}
                        todo={todo}
                        setTodo={setTodo}
                        provided={provided}
                        saveTodoDebounced={saveTodoDebounced}
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
