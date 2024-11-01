import {useState} from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile
} from "firebase/auth"
import {setDoc, doc, getFirestore} from "firebase/firestore"
import {useNotification} from "@/components/Notification/useNotification"
import {defaultPhotoURL} from "@/utils"
import { errorMessages } from "./errorMessages"
import "./Auth.scss"

const RegisterForm = ({ onAction, onSubmit, isLoading }) => {
  return (
    <form action="" className="form" onSubmit={onSubmit} data-auth="register">
      <h4 className="title--md form__title">Sign up</h4>
      <fieldset className="form__group">
        <legend className="visually-hidden">Personal Information</legend>
        <input type="text" name="firstName" className="form__input" placeholder="First Name" required />
        <input type="text" name="lastName" className="form__input" placeholder="Last Name" required />
        <input type="email" name="email" className="form__input" placeholder="Email" required />
        <input type="password" name="password" className="form__input" placeholder="Password" required />
      </fieldset>
      <button
        type="submit"
        className="btn btn-reset form__submit"
        disabled={isLoading}
        aria-label="Submit">
      </button>
      <h4 className="form__action">
        Already have an account?
        <button className="btn btn-reset" onClick={onAction} disabled={isLoading}>Sign in</button>
      </h4>
    </form>
  )
}

const LoginForm = ({ onAction, onSubmit, isLoading }) => {
  return (
    <form action="" className="form" onSubmit={onSubmit} data-auth="login">
      <h4 className="title--md form__title">Sign in</h4>
      <fieldset className="form__group">
        <legend className="visually-hidden">Credentials</legend>
        <input type="email" name="email" className="form__input" placeholder="Email" required />
        <input type="password" name="password" className="form__input" placeholder="Password" required />
      </fieldset>
      <button
        type="submit"
        className="btn btn-reset form__submit"
        disabled={isLoading}
        aria-label="Submit">
      </button>
      <h4 className="form__action">
        Don't have an account?
        <button className="btn btn-reset" onClick={onAction} disabled={isLoading}>Sign up</button>
      </h4>
    </form>
  )
}

export const Auth = () => {
  const [api, contextHolder] = useNotification()
  const [hasAccount, setHasAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function submitHandler(event) {
    event.preventDefault()
    setIsLoading(true)

    const fData = new FormData(event.target)

    const auth = getAuth()
    const firestore = getFirestore()

    // Register / login

    try {
      const authMethod = event.target.dataset.auth === "login"
        ? signInWithEmailAndPassword
        : createUserWithEmailAndPassword

      await authMethod(
        auth,
        fData.get("email"),
        fData.get("password")
      )

      if (event.target.dataset.auth === "register") {
        // Updating user profile
        await updateProfile(auth.currentUser, {
          displayName: `${fData.get("firstName")} ${fData.get("lastName")}`,
          photoURL: defaultPhotoURL
        })


        // Creating a kanban for the user
        await setDoc(doc(firestore, "kanban", auth.currentUser.uid), {
          todo: [],
          inProgress: [],
          done: []
        })

        // Reloading the profile
        await auth.currentUser.reload()
      }
    } catch (e) {
      setIsLoading(false)

      const error = errorMessages[e.code]

      if (!error) {
        return api.add({
          title: "😅 Unknown error",
          text: "Please, try again",
          duration: 5000
        })
      }

      api.add({
        ...error,
        duration: 5000
      })
    }
  }

  return (
    <section className="auth">
      {contextHolder}
      {hasAccount
        ? <LoginForm onAction={() => setHasAccount(false)} onSubmit={submitHandler} isLoading={isLoading} />
        : <RegisterForm onAction={() => setHasAccount(true)} onSubmit={submitHandler} isLoading={isLoading} />
      }
    </section>
  )
}
