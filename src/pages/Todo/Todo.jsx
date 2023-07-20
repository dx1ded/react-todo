import {useState, useEffect, useRef} from "react"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import {useParams, useNavigate} from "react-router-dom"
import {v4} from "uuid"
import {onAuthStateChanged} from "firebase/auth"
import {updateDoc, deleteField} from "firebase/firestore/lite"
import {getUserDoc} from "../../getUserDoc"
import {useAuth} from "../../hooks/useAuth"
import {useDB} from "../../hooks/useDB"
import {useSaveDebounced} from "../../hooks/useSaveDebounced"
import {useMetrics} from "../../hooks/useMetrics"
import {Task} from "./Task"
import {Loader} from "../../components/Loader/Loader"
import "./Todo.scss"

export const Todo = () => {
  const auth = useAuth()
  const db = useDB()
  const { id } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState({})
  const [todo, setTodo] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [saveData, contextHolder, api] = useSaveDebounced(doc.ref, `todos.${todo.id}`)
  const [saveMetrics, updateMetricsBy, setMetrics] = useMetrics(doc.ref, "list")
  const inputRef = useRef(null)

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) return

      try {
        const doc = await getUserDoc(db, user.email)
        const data = doc.data()
        const todo = data.todos[id]

        if (!todo) return

        setDoc(doc)
        setTodo(todo)
        setMetrics(data.metrics.list)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
      }
    })

    return listen
  }, [auth, db, id, setMetrics])

  if (isLoading) {
    return <Loader />
  }

  const completedTasks = todo.tasks.reduce(
    (acc, task) => task.done ? acc + 1 : acc, 0
  )

  const changeName = (event) => {
    const newState = {
      ...todo,
      name: event.target.value,
      date_modified: Date.now()
    }

    setTodo(newState)
    saveData(newState)
  }

  const deleteTodo = () => {
    const confirm = async () => {
      await updateDoc(doc.ref, {
        [`todos.${id}`]: deleteField()
      })

      const tasksToDo = todo.tasks.filter((task) => !task.done).length

      updateMetricsBy("To-Do", -tasksToDo)
      updateMetricsBy("Done", -(todo.tasks.length - tasksToDo))

      saveMetrics()
      navigate("/list")
    }

    api.add({
      title: "🗑️ Do you want to delete?",
      text: "If you really want to delete the todo-list, then confirm by clicking the button below",
      children: (
        <button
          className="btn btn-reset todo__delete-confirm"
          onClick={confirm}>
          Delete
        </button>
      )
    })
  }

  const addTask = () => {
    if (!inputRef.current.value) {
      return api.add({
        title: "😶 Cannot be empty!",
        text: "The name of the task cannot be empty. Please enter any letters!",
        duration: 5000
      })
    }

    const newState = {
      ...todo,
      date_modified: Date.now(),
      tasks: [
        {
          id: v4(),
          name: inputRef.current.value,
          done: false
        },
        ...todo.tasks
      ]
    }

    setTodo(newState)
    updateMetricsBy("To-Do", 1)
    saveData(newState, saveMetrics)

    inputRef.current.value = ""
  }

  const handleDragDrop = (results) => {
    const { source, destination } = results

    if (!destination || source.index === destination.index) return

    const [
      { index: sIndex },
      { index: dIndex }
    ] = [source, destination]

    const filteredCol = todo.tasks.filter((_, i) => i !== sIndex)

    const newState = {
      ...todo,
      date_modified: Date.now(),
      tasks: [
        ...filteredCol.slice(0, dIndex),
        todo.tasks[sIndex],
        ...filteredCol.slice(dIndex)
      ]
    }

    setTodo(newState)
    saveData(newState)
  }

  return (
    <section className="todo">
      {contextHolder}
      <div className="todo__header">
        <input
          type="text"
          className="todo__name"
          defaultValue={todo.name}
          onChange={changeName}
        />
        <button className="btn btn-reset todo__delete" onClick={deleteTodo}>
          Delete
        </button>
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
            <span>{todo.tasks.length}</span>
          </h4>
          <h4 className="todo__label" style={{color: "var(--color-purple)"}}>
            Completed
            <span>{completedTasks} of {todo.tasks.length}</span>
          </h4>
        </div>
        <DragDropContext onDragEnd={handleDragDrop}>
          <Droppable droppableId="tasks" type="group">
            {(provided) => (
              <ul className="list-reset tasks" {...provided.droppableProps} ref={provided.innerRef}>
                {todo.tasks.map((task, i) =>
                  <Draggable draggableId={`task/${task.id}`} key={task.id} index={i} isDragDisabled={task.done}>
                    {(provided) => (
                      <Task
                        name={task.name}
                        isDone={task.done}
                        index={i}
                        saveMetrics={saveMetrics}
                        updateMetricsBy={updateMetricsBy}
                        todo={todo}
                        setTodo={setTodo}
                        provided={provided}
                        saveData={saveData}
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
