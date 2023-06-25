import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
import {useAuth} from "../../hooks/useAuth"
import "./Auth.scss"

const RegisterForm = ({ onAction, onSubmit }) => {
  return (
    <form action="" className="form" onSubmit={onSubmit} data-auth="register">
      <h4 className="title--md form__title">Sign up</h4>
      <fieldset className="form__group">
        <legend className="visually-hidden">Data to submit</legend>
        <input type="text" name="username" className="form__input" placeholder="Username" />
        <input type="email" name="email" className="form__input" placeholder="Email" />
        <input type="password" name="password" className="form__input" placeholder="Password" />
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
        <input type="email" name="email" className="form__input" placeholder="Email" />
        <input type="password" name="password" className="form__input" placeholder="Password" />
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
  const auth = useAuth()
  const [isAccount, setIsAccount] = useState(false)
  const navigate = useNavigate()

  async function submitHandler(event) {
    event.preventDefault()

    const fData = new FormData(event.target)

    try {
      const authMethod = event.target.dataset.auth === "login"
        ? signInWithEmailAndPassword
        : createUserWithEmailAndPassword

      await authMethod(
        auth,
        fData.get("email"),
        fData.get("password")
      )

      return navigate("/")
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section className="auth">
      {isAccount
        ? <LoginForm onAction={() => setIsAccount(!isAccount)} onSubmit={submitHandler} />
        : <RegisterForm onAction={() => setIsAccount((!isAccount))} onSubmit={submitHandler} />
      }
    </section>
  )
}
