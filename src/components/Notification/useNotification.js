import {useState, useMemo, useCallback} from "react"
import {createPortal} from "react-dom"
import {v4} from "uuid"
import {useMountTransition} from "../../hooks/useMountTransition"
import {Notification} from "./Notification"

const DEFAULT_DURATION = 10000

const Layout = ({ element, toggle }) => {
  const isMounted = element.isMounted
  const hasTransitionedIn = useMountTransition(isMounted, 500)

  return (isMounted || hasTransitionedIn) && (
    <Notification
      title={element.title}
      text={element.text}
      duration={element.duration || DEFAULT_DURATION}
      hasTransitionedIn={hasTransitionedIn}
      isMounted={isMounted}
      toggle={toggle}
    >
      {element.children}
    </Notification>
  )
}

function getContainer() {
  const expectedContainer = document.querySelector(".notifications")
  if (expectedContainer) return expectedContainer

  const $root = document.querySelector("#root")
  const container = document.createElement("div")
  container.className = "notifications"

  $root.append(container)
  return container
}

export const useNotification = () => {
  const [list, setList] = useState([])

  // params -> { title: string, text?: string, delay?: number = 10000, children?: <ReactComponent> }
  const add = useCallback((params) => {
    const id = v4()
    const element = {...params, id, isMounted: true}
    setList(list => [...list, element])
    return id
  }, [])

  const remove = useCallback((elementId) => {
      setList(list => list.map(elem => elem.id === elementId
        ? {...elem, isMounted: false}
        : elem
      ))
      setTimeout(() => {
        setList(list => list.filter(elem => elem.id !== elementId))
      }, 500)
    }, [])

  const contextHolder = useMemo(() => createPortal(
    <>
      {list.map((element) => (
        <Layout
          key={element.id}
          element={element}
          toggle={() => remove(element.id)}
        />
      ))}
    </>,
    getContainer()
  ), [list, remove])

  return [{add, remove}, contextHolder]
}
