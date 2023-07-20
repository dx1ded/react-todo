import {useState, useEffect} from "react"
import {onAuthStateChanged} from "firebase/auth"
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
import {Bar, Pie} from "react-chartjs-2"
import {createOptions, createBarData, createPieData} from "./Chart.functions"
import {isObjectEmpty} from "../../utils"
import {getUserDoc} from "../../getUserDoc"
import {useAuth} from "../../hooks/useAuth"
import {useDB} from "../../hooks/useDB"
import {Loader} from "../../components/Loader/Loader"
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
  const auth = useAuth()
  const db = useDB()
  const [user, setUser] = useState({})

  useEffect(() => {
    const listen = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) return

      try {
        const doc = await getUserDoc(db, user.email)

        setUser(doc.data())
        console.log(doc.data().metrics.kanban)
      } catch (e) {
        console.error(e)
      }
    })

    return listen
  }, [auth, db])


  if (isObjectEmpty(user)) {
    return <Loader />
  }

  const firstName = user.fullName.split(" ")[0]

  const columns = {
    kanban: ["To-Do", "In progress", "Done"],
    list: ["To-Do", "Done"]
  }

  return (
    <section className="dashboard">
      <div className="greeting">
        <h2 className="title--xl greeting__name">Hello, {firstName}! 🎉</h2>
        <p className="greeting__text">Here's what's happening in your Account</p>
      </div>
      <Info type="Kanban">
        <div>
          <Bar
            options={createOptions("Kanban total")}
            data={createBarData(
              columns.kanban
              .map((label) => ({
                label,
                data: user.metrics.kanban.map((period) => period[label])
              })
             ))}
          />
        </div>
        <div>
          <Pie
            data={createPieData(
              columns.kanban,
              [{
                label: "# of",
                data: columns.kanban.map((column) =>
                  user.metrics.kanban.at(-1)[column]
                )
              }]
            )}
          />
        </div>
      </Info>
      <Info type="List">
        <div>
          <Bar
            options={createOptions("List total")}
            data={createBarData(
              columns.list
              .map((label) => ({
                  label,
                  data: user.metrics.list.map((period) => period[label])
                })
              ))}
          />
        </div>
        <div>
          <Pie
            data={createPieData(
              columns.list,
              [{
                label: "# of",
                data: columns.list.map((column) =>
                  user.metrics.list.at(-1)[column]
                )
              }]
            )}
          />
        </div>
      </Info>
    </section>
  )
}
