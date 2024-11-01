import {useState, useRef} from "react"

export const Task = ({ task, todo, setTodo, provided, saveTodoDebounced }) => {
  const [isDoneButton, setIsDoneButton] = useState(false)
  const nameRef = useRef(null)

  const toggleDone = () => {
    const updatedTasks = todo.tasks.filter((t) => t.id !== task.id)

    if (task.done) {
      updatedTasks.unshift({ ...task, done: false })
    } else {
      updatedTasks.push({ ...task, done: true })
    }

    setTodo((prev) => ({
      ...prev,
      lastUpdated: Date.now(),
      tasks: updatedTasks
    }))
    saveTodoDebounced()
  }

  const changeTaskName = () => {
    const newName = nameRef.current.textContent

    if (task.name === newName) {
      return setIsDoneButton(false)
    }

    setTodo((prev) => ({
      ...prev,
      lastUpdated: Date.now(),
      tasks: prev.tasks.map((t) => t.id === task.id ? { ...t, name: newName } : t)
    }))
    saveTodoDebounced()
    setIsDoneButton(false)
  }

  const deleteTask = () => {
    setTodo((prev) => ({
      ...prev,
      lastUpdated: Date.now(),
      tasks: prev.tasks.filter((t) => t.id !== task.id)
    }))
    saveTodoDebounced()
  }

  return (
    <li
      className={`task ${task.done ? "task--done" : ""}`}
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
          onClick={() => void toggleDone()}
          disabled={isDoneButton}
        >
          <span className="material-symbols-outlined">
            {task.done ? "check_circle" : "radio_button_unchecked"}
          </span>
        </button>
        <h5
          className="task__name"
          contentEditable={isDoneButton}
          suppressContentEditableWarning
          ref={nameRef}>
          {task.name}
        </h5>
      </div>
      <div className="task__right">
        {isDoneButton
          ? <button className="btn btn-reset task__edit-done" aria-label="Change task name" onClick={() => void changeTaskName()}>
              <span className="material-symbols-outlined">done</span>
            </button>
          : (
            <>
              <button className="btn btn-reset task__edit" aria-label="Edit task" onClick={() => setIsDoneButton(true)}>
                <span className="material-symbols-outlined">edit_note</span>
              </button>
              <button className="btn btn-reset task__delete" aria-label="Delete task" onClick={() => void deleteTask()}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </>
          )
        }
      </div>
    </li>
  )
}
