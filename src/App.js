import {Suspense} from "react"
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"
import {AuthContext} from "./context/authContext"
import {DatabaseContext} from "./context/databaseContext"

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

export const App = ({ auth, db }) => (
  <AuthContext.Provider value={auth}>
    <DatabaseContext.Provider value={db}>
      <div className="container app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="auth" element={<Auth />} />
              <Route path="about" element={<About />} />
              <Route path="account" element={<Account />} />
              <Route path="kanban" element={<Kanban />} />
              <Route path="list" element={<List />} />
              <Route path="list/:id" element={<Todo />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </DatabaseContext.Provider>
  </AuthContext.Provider>
)
