import {useState} from "react"
import {useMountTransition} from "../../hooks/useMountTransition"
import "./Group.scss"

export const Group = ({ name, children }) => {
  const [isActive, setIsActive] = useState(
    JSON.parse(localStorage.getItem(`group-${name}`))
  )
  const hasTransitionedIn = useMountTransition(isActive, 200)

  const clickHandler = () => {
    localStorage.setItem(`group-${name}`, JSON.stringify(!isActive))
    setIsActive(!isActive)
  }

  return (
    <div className={`group ${isActive && hasTransitionedIn ? "group--active" : ""}`}>
      <button
        className="btn-reset group__top"
        aria-label="Open group"
        onClick={clickHandler}>
        {name}
      </button>
      <div className="group__body">{children}</div>
    </div>
  )
}
