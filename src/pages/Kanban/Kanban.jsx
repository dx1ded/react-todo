import {useEffect, useMemo, useState} from "react"
import {nanoid} from "nanoid"
import {useDebouncedCallback} from "use-debounce"
import {getFirestore, doc, getDoc, updateDoc} from "firebase/firestore"
import {DragDropContext, Droppable, Draggable} from "@hello-pangea/dnd"
import ContentEditable from "react-contenteditable"
import {useAuthContext} from "@/context/authContext"
import {useNotification} from "@/components/Notification/useNotification"
import {Loader} from "@/components/Loader/Loader"
import "./Kanban.scss"

const DEBOUNCED_SAVE_TIME = 1500

export const Kanban = () => {
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const [kanban, setKanban] = useState( {
    todo: [],
    inProgress: [],
    done: []
  })
  const kanbanDoc = useMemo(() => doc(getFirestore(), "kanban", user.id), [user.id])
  const [api, contextHolder] = useNotification()

  useEffect(() => {
    if (!user.id) return

    async function fetchKanban() {
      const snapshot = await getDoc(kanbanDoc)

      if (snapshot.exists()) {
        setKanban(snapshot.data())
      }

      setLoading(false)
    }

    fetchKanban()
  }, [kanbanDoc, user.id])

  const saveKanbanDebounced = useDebouncedCallback(async () => {
    try {
      await updateDoc(kanbanDoc, kanban)
      api.add({
        title: "👍 Saved",
        text: "Your data has been saved successfully!",
        duration: 5000
      })
    } catch (e) {
      console.log(e)
      api.add({
        title: "😔 Unknown error",
        text: "Please, try again!",
        duration: 5000
      })
    }
  }, DEBOUNCED_SAVE_TIME)

  // Saving on exit
  useEffect(() => saveKanbanDebounced.flush, [saveKanbanDebounced.flush])

  const addNewTask = () => {
    const newTask = {
      id: nanoid(8),
      name: "New task",
      description: "Task description",
      createdAt: Date.now(),
    }

    setKanban((prev) => ({ ...prev, todo: [...prev.todo, newTask] }))
    saveKanbanDebounced()
  }

  const changeTask = (draggableId, field, value) => {
    const [column, id] = draggableId.split("/")

    setKanban((prev) => ({
      ...prev,
      [column]: prev[column].map((t) => t.id === id ? { ...t, [field]: value } : t)
    }))
    saveKanbanDebounced()
  }

  const deleteTask = (draggableId) => {
    const [column, id] = draggableId.split("/")

    setKanban((prev) => ({
      ...prev,
      [column]: prev[column].filter((t) => t.id !== id)
    }))
    saveKanbanDebounced()
  }

  const handleDragDrop = (results) => {
    const { source, destination } = results

    if (
      !destination || (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
    ) return

    // `sId` and `dId` are conventionally equal to task statuses - "todo" /
    //  "isProgress" / "done"
    const [
      { droppableId: sId, index: sIndex },
      { droppableId: dId, index: dIndex }
    ] = [source, destination]

    const target = kanban[sId][sIndex]

    if (!target) {
      throw new Error("Task not found")
    }

    const newState = { ...kanban }

    newState[sId].splice(sIndex, 1)
    newState[dId].splice(dIndex, 0, target)

    setKanban(newState)
    saveKanbanDebounced()
  }

  if (loading) return <Loader />

  const markupData = [{
      name: "To-Do",
      column: "todo",
      icon: "radio_button_unchecked",
      iconColor: "red",
      newButton: true,
    },
    {
      name: "In progress",
      column: "inProgress",
      icon: "radio_button_checked",
      iconColor: "yellow",
      newButton: false,
    },
    {
      name: "Done",
      column: "done",
      icon: "expand_circle_down",
      iconColor: "green",
      newButton: false,
    }
  ]

  return (
    <>
      {contextHolder}
      <section className="kanban">
        <h2 className="title--lg kanban__title">Kanban</h2>
        <DragDropContext onDragEnd={handleDragDrop}>
          <div className="kanban__container">
            {markupData.map((data) =>
              <div key={data.name} className="kanban__column">
                <div className="kanban__header">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: data.iconColor }}>
                    {data.icon}
                  </span>
                  <h3 className="kanban__name">{data.name}</h3>
                </div>
                <Droppable droppableId={data.column} type="group">
                  {(provided) => (
                    <ul
                      className="list-reset kanban__list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {kanban[data.column].map((task, i) =>
                        <Draggable key={task.id} draggableId={`${data.column}/${task.id}`} index={i}>
                          {(provided) => (
                            <li
                              className="kanban-item"
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <div className="kanban-item__actions">
                                <span
                                  className="material-symbols-outlined kanban-item__delete"
                                  onClick={() => deleteTask(provided.draggableProps["data-rfd-draggable-id"])}>
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
                                html={task.name}
                                onChange={(e) => changeTask(provided.draggableProps["data-rfd-draggable-id"], "name", e.target.value)}
                              />
                              <ContentEditable
                                className="kanban-item__description"
                                tagName="p"
                                html={task.description}
                                onChange={(e) => changeTask(provided.draggableProps["data-rfd-draggable-id"], "description", e.target.value)}
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
