import {useState} from "react"
import {useAuth} from "../../hooks/useAuth"
import "./Kanban.scss"

function getCoords(element) {
  const box = element.getBoundingClientRect()

  return {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX
  }
}

const KanbanItem = ({ title, text, tasks, setTasks }) => {
  const mouseDownHandler = (event) => {
    let item = event.target instanceof HTMLLIElement
      ? event.target
      : event.target.closest(".kanban-item")

    const coords = getCoords(event.target)
    const shiftY = event.pageY - coords.top
    const shiftX = event.pageX - coords.left

    item.style.width = item.getBoundingClientRect().width + "px"
    item.style.position = "absolute"

    moveAt(event)

    function moveAt(event) {
      item.style.top = `${event.pageY - shiftY}px`
      item.style.left = `${event.pageX - shiftX}px`
    }

    item.ondragstart = null
    document.onmousemove = (event) => moveAt(event)

    item.onmouseup = () => {
      document.onmousemove = null
      item.style.position = "static"
      item.style.top = "unset"
      item.style.left = "unset"
    }
  }

  return (
    <li className="kanban-item" onMouseDown={mouseDownHandler}>
      <h4 className="kanban-item__title">{title}</h4>
      <p className="kanban-item__description">{text}</p>
    </li>
  )
}

export const Kanban = () => {
  const auth = useAuth()
  const [tasks, setTasks] = useState({
    todo: [
      { title: "Hello", text: "lorem lorem askdnasd, asdksamdk , 213" }
    ],
    inProgress: [
      { title: "Clean my floor", text: "I gotta clean my floor as soon as possible because I'm awaiting for my girlfriend" },
      { title: "Do some food", text: "Cook a Kyivan cake and some macaroni & cheese" }
    ],
    done: [
      { title: "Wake up at 7 am", text: "Wake up at this time because I need to develop me self-discipline" }
    ]
  })

  const addClickHandler = () => {
    setTasks({
      ...tasks,
      todo: [
        ...tasks.todo,
        { title: "New task", text: "Task description" }
      ]
    })
  }

  const mouseOverHandler = (event) => {
    console.log(event)
  }

  return (
    <section className="kanban">
      <h2 className="title--lg kanban__title">Kanban</h2>
      <div className="kanban__container">
        <div className="kanban__column">
          <div className="kanban__header">
            <span className="material-symbols-outlined" style={{color: "red"}}>radio_button_unchecked</span>
            <h3 className="kanban__name">To-Do</h3>
          </div>
          <ul className="list-reset kanban__list" onMouseOver={mouseOverHandler}>
            {tasks["todo"].map((task, i) =>
              <KanbanItem
                key={i}
                title={task.title}
                text={task.text}
                tasks={tasks}
                setTasks={setTasks}
              />
            )}
            <li className="kanban__add">
              <button
                className="btn-reset"
                aria-label="Add a new task"
                onClick={addClickHandler}>
                +
              </button>
            </li>
          </ul>
        </div>
        <div className="kanban__column" onMouseOver={mouseOverHandler}>
          <div className="kanban__header">
            <span className="material-symbols-outlined" style={{color: "yellow"}}>radio_button_checked</span>
            <h3 className="kanban__name">In progress</h3>
          </div>
          <ul className="list-reset kanban__list">
            {tasks["inProgress"].map((task, i) =>
              <KanbanItem
                key={i}
                title={task.title}
                text={task.text}
                tasks={tasks}
                setTasks={setTasks}
              />
            )}
          </ul>
        </div>
        <div className="kanban__column">
          <div className="kanban__header">
            <span className="material-symbols-outlined" style={{color: "green"}}>expand_circle_down</span>
            <h3 className="kanban__name">Done</h3>
          </div>
          <ul className="list-reset kanban__list" onMouseOver={mouseOverHandler}>
            {tasks["done"].map((task, i) =>
              <KanbanItem
                key={i}
                title={task.title}
                text={task.text}
                tasks={tasks}
                setTasks={setTasks}
              />
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
