import {useState, useRef} from "react"
import {
  signOut,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth"
import {updateDoc} from "firebase/firestore/lite"
import {useDB} from "../../hooks/useDB"
import {useAuth} from "../../hooks/useAuth"
import {getUserDoc} from "../../getUserDoc"
import {useNotification} from "../../components/Notification/useNotification"

const getErrorObject = (validity, type) => {
  let obj = {}

  console.log(validity)

  if (validity.tooShort || validity.valueMissing) {
    obj = {
      title: "🙅‍♀️ It's too short!",
      text: `The minimum length for ${type} is 6 letters. Please use a longer one!`
    }
  } else if (validity.typeMismatch || validity.patternMismatch) {
    obj = {
      title: "📕 Doesn't seem correct!",
      text: `The ${type} you have entered doesn't seem like a ${type}. Please use another one!`
    }
  }

  return obj
}

export const Action = ({ type, hasInput, children }) => {
  const db = useDB()
  const auth = useAuth()
  const [api, contextHandler] = useNotification()
  const [isActive, setIsActive] = useState(false)
  const inputRef = useRef(null)

  const buttonTypes = {
    email: "primary",
    password: "secondary",
    quit: "danger"
  }

  const clickHandler = async (event) => {
    const input = inputRef.current
    const dataName = event.target.dataset.type
    const oldEmail = auth.currentUser.email

    if (dataName === "quit") return signOut(auth)
    else if (!isActive) return setIsActive(true)

    // Input validation

    const errorObject = getErrorObject(input.validity, type)

    if (errorObject.title) return api.add({
      ...errorObject,
      duration: 5000
    })

    // If old email equals to the new one

    if (oldEmail === input.value) return api.add({
      title: "🤨 It's your e-mail",
      text: "The e-mail you have entered is yours! Please use another one!",
      duration: 5000
    })

    // Check if there's a user with that email already

    const emailIsAlreadyUsed = await getUserDoc(db, input.value)

    if (emailIsAlreadyUsed) return api.add({
      title: "👽 Already used!",
      text: "The e-mail you try to change on is already used. Please use another one!",
      duration: 5000
    })

    // Change email

    const fn = dataName === "email"
      ? updateEmail
      : updatePassword

    await changeEmail()

    async function changeEmail() {
      await fn(auth.currentUser, input.value)
        .then(async () => {
          // Update user's firestore object since it has changed
          if (dataName === "email") {
            const doc = await getUserDoc(db, oldEmail)
            await updateDoc(doc.ref, { email: input.value })
          }

          api.add({ title: `✅ Your ${type} has been updated!` })

          setIsActive(!isActive)
          input.value = ""
        })
        .catch((error) => {
          if (error.code === "auth/requires-recent-login") {
            const inputNotif = api.add({
              title: "🙄 Verification",
              text: "Enter your password again to the input below",
              duration: 999999,
              children: (
                <form className="verification" onSubmit={handleSubmit}>
                  <input type="password" name="password" className="verification__password" />
                  <input type="submit" className="btn btn-reset btn--secondary verification__submit" />
                </form>
              )
            })

            async function handleSubmit(event) {
              event.preventDefault()
              api.remove(inputNotif)

              const password = new FormData(event.target).get("password")
              const credential = EmailAuthProvider.credential(oldEmail, password)

              reauthenticateWithCredential(auth.currentUser, credential)
                .then(changeEmail)
                .catch(() => api.add({
                  title: "⛔️ Wrong password",
                  text: "The password you have enter is wrong. Try again!"
                }))
            }
          }
        })
    }
  }

  return (
    <div className={`action ${isActive ? "action--active" : ""}`}>
      {contextHandler}
      <button
        data-type={type}
        className={`btn btn-reset btn--${buttonTypes[type]} action__button`}
        onClick={clickHandler}>
        {isActive ? "Done" : children}
      </button>
      {hasInput && <input
        type={type}
        className="action__input"
        placeholder="Write something..."
        minLength={6}
        maxLength={64}
        pattern={type === "email" ? "[^@\\s]+@[^@\\s]+\\.[^@\\s]+" : "[A-Za-z0-9!@#$&()-`.+,/\\]+"}
        required
        ref={inputRef} />
      }
    </div>
  )
}
