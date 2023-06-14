import {useState} from "react"
import "./Group.scss"

export const Group = ({ name, children }) => {
  // TODO: set isActive to false by default
  const [isActive, setIsActive] = useState(true)

  return (
    <div className={`group ${isActive ? "active" : ""}`}>
      <button
        className="btn-reset group__top"
        aria-label="Open group"
        onClick={() => setIsActive(!isActive)}
      >{name}</button>
      <div className="group__body">{children}</div>
    </div>
  )
}
