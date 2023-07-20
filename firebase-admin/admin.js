const cron = require("node-cron")
const {initializeApp} = require("firebase/app")
const {getFirestore, query, collection, getDocs, updateDoc} = require("firebase/firestore")

function moveData(arr, defaultObject) {
  return arr.map((_, i) => arr[i + 1] ? arr[i + 1] : defaultObject)
}

cron.schedule("0 0 1 * *", () => {
  const app = initializeApp({
    apiKey: "AIzaSyBFQnx80j5XA2_noPvqThgtvCce3unQkdI",
    authDomain: "react-todo-eab1e.firebaseapp.com",
    projectId: "react-todo-eab1e",
    storageBucket: "react-todo-eab1e.appspot.com",
    messagingSenderId: "159401738701",
    appId: "1:159401738701:web:fb871c17c2cf404d40c484",
    measurementId: "G-K9EZ8RD945"
  })

  const db = getFirestore(app)

  getDocs(query(collection(db, "users"))).then((snapshot) => {
    snapshot.forEach((doc) => {
      const metrics = doc.data().metrics

      updateDoc(doc.ref, {
        "metrics.kanban": moveData(metrics.kanban, {
          "To-Do": 0,
          "In progress": 0,
          "Done": 0
        }),
        "metrics.list": moveData(metrics.list, {
          "To-Do": 0,
          "Done": 0
        })
      })
    })
  })
})
