import {useState} from "react"

export const Action = ({ name, isInput, type }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className={`action ${isActive ? "active" : ""}`}>
      <button
        className={`btn btn-reset btn--${type} action__button`}
        onClick={() => setIsActive(!isActive)}
      >{name}</button>
      {isInput && <input className="action__input" placeholder="Write something..." />}
    </div>
  )
}
