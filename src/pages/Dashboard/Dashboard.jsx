import dayjs from "dayjs"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  collection
} from "firebase/firestore"
import {useEffect, useState} from "react"
import {Bar, Pie} from "react-chartjs-2"
import {useAuthContext} from "@/context/authContext"
import {Loader} from "@/components/Loader/Loader"
import {getDefaultKanbanData} from "@/utils"
import {createOptions, createBarData, createPieData} from "./Chart.functions"
import "./Dashboard.scss"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Info = ({ type, children }) => {
  return (
    <div className="info">
      <h3 className="title--md info__type">{type}</h3>
      <div className="info__row">{children}</div>
    </div>
  )
}

export const Dashboard = () => {
  const { user } = useAuthContext()
  const [kanbanData, setKanbanData] = useState(getDefaultKanbanData())
  const [todoData, setTodoData] = useState({ Todo: 0, Done: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user.id) return

    const db = getFirestore()

    async function fetchData() {
      const kanbanDoc = await getDoc(doc(db, "kanban", user.id))

      if (kanbanDoc.exists()) {
        const state = getDefaultKanbanData()
        const kanban = kanbanDoc.data()

        const fourMonthsAgo = dayjs().subtract(4, "months").valueOf()

        const updateStats = (tasks, statusKey) => {
          tasks
            .filter((t) => t.createdAt > fourMonthsAgo)
            .forEach((t) => {
              const monthKey = dayjs(t.createdAt).format("MMM")
              const monthIndex = state.findIndex((item) => item.name === monthKey)

              if (monthIndex !== -1) {
                state[monthIndex].stats[statusKey] += 1
              }
            })
        }

        updateStats(kanban.todo, "todo")
        updateStats(kanban.inProgress, "inProgress")
        updateStats(kanban.done, "done")

        setKanbanData(state)
      }

      const todos = await getDocs(query(
        collection(db, "todos"),
        where("userId", "==", user.id),
        where("lastUpdated", ">", dayjs().startOf("month").valueOf())
      ))

      if (!todos.empty) {
        const state = { Todo: 0, Done: 0 }

        todos.forEach((doc) => {
          const todo = doc.data()

          state.Todo += todo.tasks.filter((t) => !t.done).length
          state.Done += todo.tasks.filter((t) => t.done).length
        })

        setTodoData(state)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [user.id])

  if (isLoading) {
    return <Loader />
  }

  const firstName = user.displayName?.split(" ")[0]

  return (
    <section className="dashboard">
      <div className="greeting">
        <h2 className="title--xl greeting__name">Hello, {firstName}!!!! 🎉</h2>
        <p className="greeting__text">Here's what's happening in your Account</p>
      </div>
      <Info type="Kanban">
        <div>
          <Bar
            options={createOptions("Kanban total")}
            data={createBarData([
              {
                label: "To-Do",
                data: kanbanData.map((item) => item.stats.todo)
              },
              {
                label: "In Progress",
                data: kanbanData.map((item) => item.stats.inProgress)
              },
              {
                label: "Done",
                data: kanbanData.map((item) => item.stats.done)
              }
            ])}
          />
        </div>
      </Info>
      <Info type="List">
        <div>
          <Pie
            data={createPieData(
              Object.keys(todoData),
              [{
                label: "# of",
                data: Object.entries(todoData).map(([label, value]) => ({ label, value }))
              }]
            )}
          />
        </div>
      </Info>
    </section>
  )
}
