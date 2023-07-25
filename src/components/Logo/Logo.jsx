import {NavLink} from "react-router-dom"
import "./Logo.scss"

export const Logo = () => (
  <NavLink to="/" className="logo">
    <img className="logo__image" src="./images/rocket.svg" alt="" aria-hidden="true" />
    <h2 className="logo__name">
      to
      <span>do</span>
    </h2>
  </NavLink>
)
