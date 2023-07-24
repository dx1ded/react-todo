import {useState, useContext} from "react"
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
import {collection, addDoc} from "firebase/firestore/lite"
import {getUserDoc, getUserDocBy} from "@/getUserDoc"
import {FirebaseContext} from "@/context/firebaseContext"
import {useNotification} from "@components/Notification/useNotification"
import "./Auth.scss"

function createUserModel(fData) {
  return {
    email: fData.get("email"),
    username: fData.get("username"),
    fullName: fData.get("firstName") + " " + fData.get("lastName"),
    avatar: "https://i.stack.imgur.com/frlIf.png",
    kanban: {
      "To-Do": [],
      "In progress": [],
      "Done": []
    },
    todos: {},
    metrics: {
      kanban: [
        { "To-Do": 0, "In progress": 0, "Done": 0 },
        { "To-Do": 0, "In progress": 0, "Done": 0 },
        { "To-Do": 0, "In progress": 0, "Done": 0 },
        { "To-Do": 0, "In progress": 0, "Done": 0 }
      ],
      list: [
        { "To-Do": 0, "Done": 0 },
        { "To-Do": 0, "Done": 0 },
        { "To-Do": 0, "Done": 0 },
        { "To-Do": 0, "Done": 0 }
      ]
    }
  }
}

const RegisterForm = ({ onAction, onSubmit, isLoading }) => {
  return (
    <form action="" className="form" onSubmit={onSubmit} data-auth="register">
      <h4 className="title--md form__title">Sign up</h4>
      <fieldset className="form__group">
        <legend className="visually-hidden">Data to submit</legend>
        <input type="text" name="firstName" className="form__input" placeholder="First Name" required />
        <input type="text" name="lastName" className="form__input" placeholder="Last Name" required />
        <input type="text" name="username" className="form__input" placeholder="Username" required />
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
        <legend className="visually-hidden">Data to submit</legend>
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
  const {auth, db} = useContext(FirebaseContext)
  const [api, contextHolder] = useNotification()
  const [hasAccount, setHasAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function submitHandler(event) {
    event.preventDefault()
    setIsLoading(true)

    const fData = new FormData(event.target)

    async function checkForIssues() {
      if (event.target.dataset.auth === "register") {
        // Check if the username is already used

        const usernameAlreadyUsed = await getUserDocBy(db, "username", fData.get("username"))

        if (usernameAlreadyUsed) throw new Error("auth/username-already-used")

        // Check if the email is already used

        const emailAlreadyUsed = await getUserDoc(db, fData.get("email"))

        if (emailAlreadyUsed) throw new Error("auth/email-already-used")
      }
    }

    // Register / login

    try {
      const authMethod = event.target.dataset.auth === "login"
        ? signInWithEmailAndPassword
        : createUserWithEmailAndPassword

      if (event.target.dataset.auth === "register") {
        // Check for issues

        await checkForIssues()

        // Add user document to the database

        await addDoc(
          collection(db, "users"),
          createUserModel(fData)
        )
      }

      await authMethod(
        auth,
        fData.get("email"),
        fData.get("password")
      )
    } catch (e) {
      setIsLoading(false)
      switch (e.code || e.message) {
        case "auth/user-not-found":
          return api.add({
            title: "🙉 User not found!",
            text: "Check your e-mail or password, perhaps you made a mistake.",
            duration: 5000
          })
        case "auth/wrong-password":
          return api.add({
            title: "🙉 User not found!",
            text: "Check your e-mail or password, perhaps you made a mistake.",
            duration: 5000
          })
        case "auth/username-already-used":
          return api.add({
            title: "😕 Username is already used",
            text: "The username you have entered is already used. Please use another one!",
            duration: 5000
          })
        case "auth/email-already-used":
          return api.add({
            title: "😤 E-mail is already used",
            text: "The e-mail you have entered is already used. Please use another one!",
            duration: 5000
          })
        case "auth/too-many-requests":
          return api.add({
            title: "😤 Too many requests",
            text: "Hold on! Give us a second to chill out. Try again in a few seconds.",
            duration: 5000
          })
      }
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
