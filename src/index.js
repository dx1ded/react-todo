import "./styles/index.scss"
import React from "react"
import ReactDOM from "react-dom/client"
import {initializeApp} from "firebase/app"
import {OnAuthStateChanged} from "@/components/OnAuthStateChanged"
import {AuthProvider} from "@/context/authContext"
import {App} from "./App"

initializeApp({
  apiKey: "AIzaSyBFQnx80j5XA2_noPvqThgtvCce3unQkdI",
  authDomain: "react-todo-eab1e.firebaseapp.com",
  projectId: "react-todo-eab1e",
  storageBucket: "react-todo-eab1e.appspot.com",
  messagingSenderId: "159401738701",
  appId: "1:159401738701:web:fb871c17c2cf404d40c484",
  measurementId: "G-K9EZ8RD945"
})

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <AuthProvider>
        <OnAuthStateChanged>
          <App />
        </OnAuthStateChanged>
      </AuthProvider>
    </React.StrictMode>
  )
