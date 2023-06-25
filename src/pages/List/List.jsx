import {NavLink} from "react-router-dom"
import {useAuth} from "../../hooks/useAuth"
import "./List.scss"

const ListItem = ({ id, name, dateModified }) => (
  <NavLink to={"/list/" + id} className="list-item">
    <span className="list-item__name">{name}</span>
    <time className="list-item__date">{dateModified}</time>
  </NavLink>
)

export const List = () => {
  useAuth()

  return (
    <section className="list">
      <h2 className="title--lg list__title">List</h2>
      <div className="list__container">
        <div className="list__labels">
          <h4 className="list__label">Name</h4>
          <h4 className="list__label">Date modified</h4>
        </div>
        <div className="list__items">
          <ListItem
            id="3491239"
            name="Daily Routine"
            dateModified="24.05.2020" />
          <ListItem
            id="532"
            name="Deals"
            dateModified="24.05.2020" />
          <button className="btn btn-reset list__add">Add item</button>
        </div>
      </div>
    </section>
  )
}
