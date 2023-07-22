import {useState, useEffect} from "react"
import "./Notification.scss"

export const Notification = ({
  title,
  text,
  duration,
  hasTransitionedIn,
  isMounted,
  toggle,
  children
}) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevState) => prevState - 1)
      if (progress === 0) toggle()
    }, duration / 100)

    return () => clearInterval(interval)
  }, [toggle, progress, duration])

  return (
    <div className={`notification ${!isMounted && hasTransitionedIn ? "notification--closing" : ""}`}>
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
    </div>
  )
}

/* Classes to use
* notification__container
* notification__button
* notification__input
*/
