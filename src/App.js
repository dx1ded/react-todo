import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"
import {PrivateRoutes, PublicRoutes} from "./components/Routes"
import {Sidebar} from "./components/Sidebar/Sidebar"
import {Dashboard} from "./pages/Dashboard/Dashboard"
import {Auth} from "./pages/Auth/Auth"
import {About} from "./pages/About/About"
import {Account} from "./pages/Account/Account"
import {Kanban} from "./pages/Kanban/Kanban"
import {List} from "./pages/List/List"
import {Todo} from "./pages/Todo/Todo"

const Layout = () => (
  <>
    <Sidebar />
    <Outlet />
  </>
)

export const App = () => {
  return (
    <div className="container app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Private Routes */}
            <Route path="/" element={<PrivateRoutes />}>
              <Route index element={<Dashboard />} />
              <Route path="account" element={<Account />} />
              <Route path="kanban" element={<Kanban />} />
              <Route path="list" element={<List />} />
              <Route path="list/:id" element={<Todo />} />
            </Route>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoutes />}>
              <Route path="auth" element={<Auth />} />
              <Route path="about" element={<About />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
