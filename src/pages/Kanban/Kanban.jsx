import {useState, useEffect} from "react"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import ContentEditable from "react-contenteditable"
import {onAuthStateChanged} from "firebase/auth"
import {getUserDoc} from "../../getUserDoc"
import {isObjectEmpty} from "../../utils"
import {useDB} from "../../hooks/useDB"
import {useAuth} from "../../hooks/useAuth"
import {useSaveDebounced} from "../../hooks/useSaveDebounced"
import {Loader} from "../../components/Loader/Loader"
import "./Kanban.scss"

export const Kanban = () => {
  const auth = useAuth()
  const db = useDB()
  const [doc, setDoc] = useState({})
  const [kanban, setKanban] = useState({})
  const [saveData, contextHolder] = useSaveDebounced(doc.ref, "kanban")

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) return

      try {
        const doc = await getUserDoc(db, user.email)

        setDoc(doc)
        setKanban(doc.data().kanban)
      } catch (e) {
        console.error(e)
      }
    })

    return listen
  }, [auth, db])

  const markupData = [
    {
      name: "To-Do",
      icon: "radio_button_unchecked",
      iconColor: "red",
      newButton: true
    },
    {
      name: "In progress",
      icon: "radio_button_checked",
      iconColor: "yellow"
    },
    {
      name: "Done",
      icon: "expand_circle_down",
      iconColor: "green"
    }
  ]

  const addNewTask = () => {
    const newState = {
      ...kanban,
      "To-Do": [
        ...kanban["To-Do"],
        { title: "New task", text: "Task description" }
      ]
    }

    setKanban(newState)
    saveData(newState)
  }
  const changeTask = (props, event, type) => {
    const [columnName, index] = props["data-rbd-draggable-id"].split("/")

    const newState = {
      ...kanban,
      [columnName]: kanban[columnName].map(
        (item, i) => i === +index
          ? { ...kanban[columnName][index], [type]: event.target.value }
          : item
      )
    }

    setKanban(newState)
    saveData(newState)
  }
  const deleteTask = (props) => {
    const [columnName, index] = props["data-rbd-draggable-id"].split("/")

    const newState = {
      ...kanban,
      [columnName]: kanban[columnName].filter((_, i) => i !== +index)
    }

    setKanban(newState)
    saveData(newState)
  }
  const handleDragDrop = (results) => {
    const { source, destination } = results

    if (
      !destination || (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
    ) return

    const [
      { droppableId: sId, index: sIndex },
      { droppableId: dId, index: dIndex }
    ] = [source, destination]

    const filteredCol = kanban[dId].filter((_, i) => i !== sIndex)

    let newState = {
      ...kanban,
      [sId]: kanban[sId].filter((_, i) => i !== sIndex),
      [dId]: [
        ...(sId === dId ? filteredCol : kanban[dId]).slice(0, dIndex),
        kanban[sId][sIndex],
        ...(sId === dId ? filteredCol : kanban[dId]).slice(dIndex)
      ]
    }

    setKanban(newState)
    saveData(newState)
  }

  if (isObjectEmpty(kanban)) {
    return <Loader />
  }

  return (
    <>
      {contextHolder}
      <section className="kanban">
        <h2 className="title--lg kanban__title">Kanban</h2>
        <DragDropContext onDragEnd={handleDragDrop}>
          <div className="kanban__container">
            {markupData.map((data) =>
              <div className="kanban__column" key={data.name}>
                <div className="kanban__header">
                  <span
                    className="material-symbols-outlined"
                    style={{color: data.iconColor}}>
                    {data.icon}
                  </span>
                  <h3 className="kanban__name">{data.name}</h3>
                </div>
                <Droppable droppableId={data.name} type="group">
                  {(provided) => (
                    <ul
                      className="list-reset kanban__list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {kanban[data.name].map((task, i) =>
                        <Draggable draggableId={`${data.name}/${i}`} key={i} index={i}>
                          {(provided) => (
                            <li
                              className="kanban-item"
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <div className="kanban-item__actions">
                                <span
                                  className="material-symbols-outlined kanban-item__delete"
                                  onClick={() => deleteTask(provided.draggableProps)}>
                                  delete
                                </span>
                                <span
                                  className="material-symbols-outlined kanban-item__drag"
                                  {...provided.dragHandleProps}>
                                  drag_handle
                                </span>
                              </div>
                              <ContentEditable
                                className="kanban-item__title"
                                tagName="h4"
                                html={task.title}
                                onChange={(event) => changeTask(provided.draggableProps, event, "title")}
                              />
                              <ContentEditable
                                className="kanban-item__description"
                                tagName="p"
                                html={task.text}
                                onChange={(event) => changeTask(provided.draggableProps, event, "text")}
                              />
                            </li>
                          )}
                        </Draggable>
                      )}
                      {data.newButton &&
                        <li className="kanban__add">
                          <button
                            className="btn-reset"
                            aria-label="Add a new task"
                            onClick={addNewTask}>
                            +
                          </button>
                        </li>
                      }
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            )}
          </div>
        </DragDropContext>
      </section>
    </>
  )
}
