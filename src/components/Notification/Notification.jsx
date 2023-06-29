import {useState, useEffect} from "react"
import {createPortal} from "react-dom"
import "./Notification.scss"

const DURATION = 10000 // 10 sec

export const Notification = ({
  title,
  text,
  hasTransitionedIn,
  isMounted,
  toggle,
  children
}) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const timeout = setTimeout(toggle, DURATION)
    const interval = setInterval(() => {
      setProgress((prevState) => prevState - 1)
    }, DURATION / 100)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [toggle])

  return createPortal(
    <div className={`notification ${hasTransitionedIn && isMounted ? "notification--open" : ""}`}>
      <div className="notification__header">
        <h2 className="notification__title">{title}</h2>
        <button
          className="btn-reset notification__close"
          aria-label="Close notification"
          onClick={toggle}
        >
          <span></span>
          <span></span>
        </button>
      </div>
      <div className="notification__body">
        {text &&  <p className="notification__text">{text}</p>}
        {children}
      </div>
      <div className="notification__progress" style={{width: `${progress}%`}}></div>
    </div>,
    document.body
  )
}
