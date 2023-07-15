import {useState, useRef} from "react"

export const Task = ({ name, isDone, index, list, setList, provided }) => {
  const [isDoneButton, setIsDoneButton] = useState(false)
  const nameRef = useRef(null)

  const toggleDone = () => {
    const excludedList = list.tasks.filter((_, i) => i !== index)
    let toInsertIndex = excludedList.findIndex((task) => task.done)

    if (!~toInsertIndex) {
      toInsertIndex = excludedList.length
    }

    const tasks = [...excludedList]

    tasks.splice(isDone ? 0 : toInsertIndex, 0, {
      ...list.tasks[index],
      done: !list.tasks[index].done
    })

    const newState = { ...list, tasks }

    setList(newState)
  }

  const editTask = () => {
    const input = nameRef.current

    input.focus()

    setIsDoneButton(true)
  }

  const changeTaskName = () => {
    setList({
      ...list,
      tasks: list.tasks.map((task, i) => i === index
        ? { ...list.tasks[i], name: nameRef.current.textContent }
        : task
      )
    })

    setIsDoneButton(false)
  }

  const deleteTask = () => {
    setList({
      ...list,
      tasks: list.tasks.filter((_, i) => i !== index)
    })
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
