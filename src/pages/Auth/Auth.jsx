import {useState, useContext} from "react"
import {useNavigate} from "react-router-dom"
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

const RegisterForm = ({ onAction, onSubmit }) => {
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
      <input type="submit" className="btn btn-reset form__submit" />
      <h4 className="form__action">
        Already have an account?
        <button className="btn btn-reset" onClick={onAction}>Sign in</button>
      </h4>
    </form>
  )
}

const LoginForm = ({ onAction, onSubmit }) => {
  return (
    <form action="" className="form" onSubmit={onSubmit} data-auth="login">
      <h4 className="title--md form__title">Sign in</h4>
      <fieldset className="form__group">
        <legend className="visually-hidden">Data to submit</legend>
        <input type="email" name="email" className="form__input" placeholder="Email" required />
        <input type="password" name="password" className="form__input" placeholder="Password" required />
      </fieldset>
      <input type="submit" className="btn btn-reset form__submit" />
      <h4 className="form__action">
        Don't have an account?
        <button className="btn btn-reset" onClick={onAction}>Sign up</button>
      </h4>
    </form>
  )
}

export const Auth = () => {
  const {auth, db} = useContext(FirebaseContext)
  const [api, contextHolder] = useNotification()
  const [hasAccount, setHasAccount] = useState(false)
  const navigate = useNavigate()

  async function submitHandler(event) {
    event.preventDefault()

    const fData = new FormData(event.target)

    if (event.target.dataset.auth === "register") {
      // Check if the username is already used

      const usernameAlreadyUsed = await getUserDocBy(db, "username", fData.get("username"))

      if (usernameAlreadyUsed) return api.add({
        title: "😕 Username is already used",
        text: "The username you have entered is already used. Please use another one!",
        duration: 5000
      })

      // Check if the email is already used

      const emailAlreadyUsed = await getUserDoc(db, fData.get("email"))

      if (emailAlreadyUsed) return api.add({
        title: "😤 E-mail is already used",
        text: "The e-mail you have entered is already used. Please use another one!",
        duration: 5000
      })
    }

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
        await addDoc(
          collection(db, "users"),
          createUserModel(fData)
        )
      }

      return navigate("/")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="auth">
      {contextHolder}
      {hasAccount
        ? <LoginForm onAction={() => setHasAccount(false)} onSubmit={submitHandler} />
        : <RegisterForm onAction={() => setHasAccount(true)} onSubmit={submitHandler} />
      }
    </section>
  )
}
