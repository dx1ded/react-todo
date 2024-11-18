import "./styles/index.scss"
import React from "react"
import ReactDOM from "react-dom/client"
import {initializeApp} from "firebase/app"
import {OnAuthStateChanged} from "@/components/OnAuthStateChanged"
import {AuthProvider} from "@/context/authContext"
import {App} from "./App"

initializeApp({
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID
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
