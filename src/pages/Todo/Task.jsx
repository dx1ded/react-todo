import {useState, useRef} from "react"
import {flushSync} from "react-dom"

const getField = (isDone) => isDone ? "Done" : "To-Do"

export const Task = ({ name, isDone, index, saveMetrics, updateMetricsBy, todo, setTodo, provided, saveData }) => {
  const [isDoneButton, setIsDoneButton] = useState(false)
  const nameRef = useRef(null)

  const toggleDone = () => {
    const excludedList = todo.tasks.filter((_, i) => i !== index)
    let toInsertIndex = excludedList.findIndex((task) => task.done)

    if (!~toInsertIndex) {
      toInsertIndex = excludedList.length
    }

    const tasks = [...excludedList]

    tasks.splice(isDone ? 0 : toInsertIndex, 0, {
      ...todo.tasks[index],
      done: !todo.tasks[index].done,
    })

    const newState = {
      ...todo,
      date_modified: Date.now(),
      tasks
    }

    setTodo(newState)
    updateMetricsBy(getField(todo.tasks[index].done), -1)
    updateMetricsBy(getField(!todo.tasks[index].done), 1)
    saveData(newState, saveMetrics)
  }

  const editTask = () => {
    flushSync(() => setIsDoneButton(true))

    nameRef.current.focus()
  }

  const changeTaskName = () => {
    if (name === nameRef.current.textContent) {
      return setIsDoneButton(false)
    }

    const newState = {
      ...todo,
      date_modified: Date.now(),
      tasks: todo.tasks.map((task, i) => i === index
        ? { ...todo.tasks[i], name: nameRef.current.textContent }
        : task
      )
    }

    setTodo(newState)
    saveData(newState)
    setIsDoneButton(false)
  }

  const deleteTask = () => {
    const newState = {
      ...todo,
      date_modified: Date.now(),
      tasks: todo.tasks.filter((_, i) => i !== index)
    }

    setTodo(newState)
    updateMetricsBy(getField(todo.tasks[index].done), -1)
    saveData(newState, saveMetrics)
  }

  return (
    <li
      className={`task ${isDone ? "task--done" : ""}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="task__left">
        <span
          className="material-symbols-outlined task__drag"
          {...provided.dragHandleProps}>
          drag_handle
        </span>
        <button
          className="btn btn-reset task__done"
          aria-label="Mark as done"
          onClick={toggleDone}
          disabled={isDoneButton}
        >
          <span className="material-symbols-outlined">
            {isDone ? "check_circle" : "radio_button_unchecked"}
          </span>
        </button>
        <h5
          className="task__name"
          contentEditable={isDoneButton}
          suppressContentEditableWarning
          ref={nameRef}>
          {name}
        </h5>
      </div>
      <div className="task__right">
        {isDoneButton
          ? <button className="btn btn-reset task__edit-done" aria-label="Change task name" onClick={changeTaskName}>
              <span className="material-symbols-outlined">done</span>
            </button>
          : (
            <>
              <button className="btn btn-reset task__edit" aria-label="Edit task" onClick={editTask}>
                <span className="material-symbols-outlined">edit_note</span>
              </button>
              <button className="btn btn-reset task__delete" aria-label="Delete task" onClick={deleteTask}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </>
          )
        }
      </div>
    </li>
  )
}
