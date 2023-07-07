import {useState, useRef} from "react"
import {signOut, updateEmail, updatePassword} from "firebase/auth"
import {updateDoc} from "firebase/firestore/lite"
import {useDB} from "../../hooks/useDB"
import {getUserDoc} from "../../getUserDoc"
import {useNotification} from "../../components/Notification/useNotification"

export const Action = ({ name, isInput, type, auth, children }) => {
  const db = useDB()
  const inputRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [api, contextHandler] = useNotification()

  const clickHandler = async (event) => {
    const dataName = event.target.dataset.name
    if (dataName === "quit") {
      return signOut(auth)
    }
    else if (!isActive) return setIsActive(!isActive)

    if (inputRef.current.validity.tooShort) {
      return api.add({
        title: "🙅‍♀️ It's too short!",
        text: `The minimum length for ${name} is 6 letters, please use a longer one`
      })
    }

    const oldEmail = auth.currentUser.email

    const fn = dataName === "email"
      ? updateEmail
      : updatePassword

    try {
      await fn(auth.currentUser, inputValue)
        .catch((error) => {
          // TODO: once I have a long authorization session - FIX IT!!!
          if (error.code === "auth/requires-recent-login") {
            api.add({
              title: "🙄 Looks suspicious!",
              text: "Enter your password again in the input below",
              children: <input
                className="" />
            })
          }
        })

      // Update users firestore since it has changed
      if (dataName === "email") {
        const doc = await getUserDoc(db, oldEmail)
        await updateDoc(doc.ref, { email: inputValue })
      }

      api.add({
        title: `✅ Your ${name} has been updated!`
      })

      setIsActive(!isActive)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={`action ${isActive ? "active" : ""}`}>
      {contextHandler}
      <button
        data-name={name}
        className={`btn btn-reset btn--${type} action__button`}
        onClick={clickHandler}
      >{isActive ? "Done" : children}
      </button>
      {isInput && <input
        type={name}
        className="action__input"
        placeholder="Write something..."
        minLength={6}
        maxLength={16}
        onChange={(e) => setInputValue(e.target.value)}
        ref={inputRef} />
      }
    </div>
  )
}
