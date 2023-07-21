import {NavLink, useLocation} from "react-router-dom"
import {isActivePath} from "../../utils"
import {Logo} from "../Logo/Logo"
import {Group} from "../Group/Group"
import "./Sidebar.scss"

// items -> [...item]
// item -> { path: string, name: string, icon: string }
const Nav = ({ items, currentPath }) => {
  return (
    <nav className="nav">
      <ul className="list-reset nav__list">
        {items.map((item, i) => (
          <li className="nav__item" key={i}>
            <NavLink
              className={`link-reset nav__link ${isActivePath(item.path, currentPath) ? "nav__link--active" : ""}`}
              to={item.path}>
              <span className="material-symbols-outlined nav__link-icon">{item.icon}</span>
              <span className="nav__link-name">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <Logo />
      <Nav
        currentPath={location.pathname}
        items={[
          { path: "/", name: "Dashboard", icon: "home" },
          { path: "/account", name: "Account", icon: "person" },
          { path: "/about", name: "About", icon: "info" }
        ]}
      />
      <Group name="TO-DO">
        <Nav
          currentPath={location.pathname}
          items={[
            { path: "/kanban", name: "Kanban", icon: "view_kanban" },
            { path: "/list", name: "List", icon: "view_list" }
          ]}
        />
      </Group>
    </aside>
  )
}
