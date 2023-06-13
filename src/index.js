import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom"
import './styles/index.scss'

import {Sidebar} from "./components/Sidebar/Sidebar"
import {Auth} from "./pages/Auth/Auth"
import {About} from "./pages/About/About"

const Layout = () => (
  <>
    <Sidebar />
    <Outlet />
  </>
)

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <div className="container app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="auth" element={<Auth />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </React.StrictMode>
  )
