import {createPortal} from "react-dom"
import "./Modal.scss"

export const Modal = ({ children, isActive, toggle }) => {
  return createPortal(
    <div className={`modal ${isActive ? "modal--active" : ""}`}>
      <button
        className="btn-reset modal__close"
        aria-label="Toggle modal"
        onClick={() => toggle(!isActive)}
      >
        <span></span>
        <span></span>
      </button>
      <div className="modal__body">
        {children}
      </div>
    </div>,
    document.body
  )
}
