import "./Todo.scss"

const Task = ({ name, isDone }) => {
  return (
    <li className={`task ${isDone ? "task--done" : ""}`}>
      <div className="task__left">
        <button className="btn btn-reset task__done" aria-label="Mark as done">
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
        <button className="btn btn-reset task__delete" aria-label="Delete task">
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>
    </li>
  )
}

export const Todo = () => {
  return (
    <section className="todo">
      <div className="todo__header">
        <input type="text" className="todo__name" defaultValue="To-Do Name" />
      </div>
      <div className="todo__body">
        <div className="todo__add">
          <input type="text" placeholder="Task name" />
          <button className="btn btn-reset">Add</button>
        </div>
        <div className="todo__labels">
          <h4 className="todo__label" style={{color: "var(--color-blue)"}}>
            Total amount
            <span>4</span>
          </h4>
          <h4 className="todo__label" style={{color: "var(--color-purple)"}}>
            Completed
            <span>2 of 5</span>
          </h4>
        </div>
        <ul className="list-reset tasks">
          <Task name="Do the washing up and keep on the pace" />
          <Task name="Do the washing up and keep on the pace" isDone={true} />
          <Task name="Do the washing up and keep on the pace" />
        </ul>
      </div>
    </section>
  )
}
