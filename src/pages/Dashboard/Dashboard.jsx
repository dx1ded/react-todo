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
import {useAuth} from "../../hooks/useAuth"

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
  useAuth()

  return (
    <section className="dashboard">
      <div className="greeting">
        <h2 className="title--xl greeting__name">Hello, Volodymyr! 🎉</h2>
        <p className="greeting__text">Here's what's happening in your Account</p>
      </div>
      <Info type="Kanban">
        <div>
          <Bar
            options={createOptions("Kanban total")}
            data={createBarData([
              { label: "To-Do", data: [0, 0, 0, 10] },
              { label: "In progress", data: [0, 0, 0, 4] },
              { label: "Done", data: [0, 0, 0, 17] }
            ])}
          />
        </div>
        <div>
          <Pie
            data={createPieData(
              ["To-Do", "In progress", "Done"],
              [{ label: "# of", data: [10, 4, 17] }]
            )}
          />
        </div>
      </Info>
      <Info type="List">
        <div>
          <Bar
            options={createOptions("List total")}
            data={createBarData([
              { label: "To-Do", data: [0, 0, 0, 2] },
              { label: "Done", data: [0, 0, 0, 5] }
            ])}
          />
        </div>
        <div>
          <Pie
            data={createPieData(
              ["To-Do", "Done"],
              [{ label: "# of", data: [2, 5] }]
            )}
          />
        </div>
      </Info>
    </section>
  )
}
