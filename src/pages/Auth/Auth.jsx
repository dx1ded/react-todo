import {useState} from "react"
import "./Auth.scss"

const RegisterForm = ({ onAction }) => {
  return (
    <form action="" className="form">
      <h4 className="title--md form__title">Sign up</h4>
      <fieldset className="form__group">
        <legend className="visually-hidden">Data to submit</legend>
        <input type="text" className="form__input" placeholder="Username" />
        <input type="email" className="form__input" placeholder="Email" />
        <input type="password" className="form__input" placeholder="Password" />
      </fieldset>
      <input type="submit" className="btn btn-reset form__submit" />
      <h4 className="form__action">
        Already have an account?
        <button className="btn btn-reset" onClick={onAction}>Sign in</button>
      </h4>
    </form>
  )
}

const LoginForm = ({ onAction }) => {
  return (
    <form action="" className="form">
      <h4 className="title--md form__title">Sign in</h4>
      <fieldset className="form__group">
        <legend className="visually-hidden">Data to submit</legend>
        <input type="email" className="form__input" placeholder="Email" />
        <input type="password" className="form__input" placeholder="Password" />
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
  const [isAccount, setIsAccount] = useState(false)

  return (
    <section className="auth">
      {isAccount
        ? <LoginForm onAction={() => setIsAccount(!isAccount)} />
        : <RegisterForm onAction={() => setIsAccount((!isAccount))} />
      }
    </section>
  )
}
