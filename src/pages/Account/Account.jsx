import {useState} from "react"
import {useAuth} from "../../hooks/useAuth"
import "./Account.scss"

const Action = ({ name, isInput, type }) => {
  useAuth()
  const [isActive, setIsActive] = useState(false)

  return (
    <div className={`action ${isActive ? "active" : ""}`}>
      <button
        className={`btn btn-reset btn--${type} action__button`}
        onClick={() => setIsActive(!isActive)}
      >{name}</button>
      {isInput && <input className="action__input" placeholder="Write something..." />}
    </div>
  )
}

export const Account = () => {
  return (
    <section className="account">
      <div className="photo">
        <div className="photo__image">
          <img src="https://i.stack.imgur.com/frlIf.png" alt="Profile picture" />
        </div>
        <button className="btn-reset photo__change">Change</button>
      </div>
      <div className="user">
        <h2 className="title--lg user__name">Volodymyr Doskochynskyi</h2>
        <h5 className="text--sm user__nickname">@vovados1</h5>

        <div className="account__actions">
          <Action
            name="Change name"
            isInput={true}
            type="primary" />
          <Action
            name="Change password"
            isInput={true}
            type="secondary" />
          <Action
            name="Quit"
            type="danger" />
        </div>
      </div>
    </section>
  )
}
