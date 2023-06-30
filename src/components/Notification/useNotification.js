import {useState, useMemo} from "react"
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
  const contextHolder = useMemo(() => (
    <div className="notifications">
      {list.map((element) => (
        <Layout
          element={element}
          key={element.id}
          toggle={() => {
            const copy = [...list]
            const indexToDelete = copy.findIndex(({ id }) => id === element.id)
            copy[indexToDelete].isMounted = false
            setList(copy)
            setTimeout(() => {
              copy.splice(indexToDelete, 1)
              setList(copy)
            }, 500)
          }}
        />
      ))}
    </div>
  ), [list])

  const add = (params) => {
    const copy = [...list]
    const uniqueId = v4()
    copy.push({ ...params, isMounted: true, id: uniqueId })
    setList(copy)

    // returns remove function
    return () => {
      const copy = [...list]
      const indexToDelete = copy.findIndex(({ id }) => id === uniqueId)
      copy.splice(indexToDelete, 1)
      setList(copy)
    }
  }

  return [add, contextHolder]
}
