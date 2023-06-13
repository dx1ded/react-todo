import {useState} from "react"
import "./Group.scss"

export const Group = ({ name, children }) => {
  const [isActive, setIsActive] = useState(false)

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
