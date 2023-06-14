import {NavLink} from "react-router-dom"
import {Logo} from "../Logo/Logo"
import {Group} from "../Group/Group"
import "./Sidebar.scss"

// items -> [...item]
// item -> { path: string, name: string, icon: string }
const Nav = ({ items }) => (
  <nav className="nav">
    <ul className="list-reset nav__list">
      {items.map((item, i) => (
        <li className="nav__item" key={i}>
          <NavLink className="link-reset nav__link" to={item.path}>
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
)

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Logo />
      <Nav
        items={[
          { path: "/", name: "Dashboard", icon: "home" },
          { path: "/account", name: "Account", icon: "person" },
          { path: "/about", name: "About", icon: "info" }
        ]}
      />
      <Group name="TO-DO">
        <Nav
          items={[
            { path: "/kanban", name: "Kanban", icon: "view_kanban" },
            { path: "/list", name: "List", icon: "view_list" }
          ]}
        />
      </Group>
    </aside>
  )
}
