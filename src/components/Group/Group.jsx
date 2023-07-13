import {useState} from "react"
import "./Group.scss"

export const Group = ({ name, children }) => {
  // TODO: set isActive to false by default
  const [isActive, setIsActive] = useState(
    JSON.parse(localStorage.getItem(`group-${name}`))
  )

  const clickHandler = () => {
    localStorage.setItem(`group-${name}`, JSON.stringify(!isActive))
    setIsActive(!isActive)
  }

  return (
    <div className={`group ${isActive ? "active" : ""}`}>
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
