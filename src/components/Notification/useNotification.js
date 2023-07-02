import {useState, useMemo, useCallback} from "react"
import {v4} from "uuid"
import {useMountTransition} from "../../hooks/useMountTransition"
import {Notification} from "./Notification"

const Layout = ({ element, toggle }) => {
  const isMounted = element.isMounted
  const hasTransitionedIn = useMountTransition(isMounted, 500)

  return (isMounted || hasTransitionedIn) && (
    <Notification
      title={element.title}
      text={element.text}
      hasTransitionedIn={hasTransitionedIn}
      isMounted={isMounted}
      toggle={toggle}
    >
      {element.children}
    </Notification>
  )
}

export const useNotification = () => {
  const [list, setList] = useState([])

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
        setList(list => list.filter(elem => elem.id !== elementId));
      }, 500)
    }, [])

  const contextHolder = useMemo(() => (
    <div className="notifications">
      {list.map((element) => (
        <Layout
          element={element}
          key={element.id}
          toggle={() => remove(element.id)}
        />
      ))}
    </div>
  ), [list, remove])

  return [add, remove, contextHolder]
}
