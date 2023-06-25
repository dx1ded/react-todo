import {useAuth} from "../../hooks/useAuth"
import "./Kanban.scss"

const KanbanItem = ({ title, description }) => {
  return (
    <li className="kanban-item">
      <h4 className="kanban-item__title">{title}</h4>
      <p className="kanban-item__description">{description}</p>
    </li>
  )
}

export const Kanban = () => {
  useAuth()

  return (
    <section className="kanban">
      <h2 className="title--lg kanban__title">Kanban</h2>
      <div className="kanban__container">
        <div className="kanban__column">
          <div className="kanban__header">
            <span className="material-symbols-outlined" style={{color: "red"}}>radio_button_unchecked</span>
            <h3 className="kanban__name">To-Do</h3>
          </div>
          <ul className="list-reset kanban__list">
            <KanbanItem
              title="Change clothes"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eum in ipsum itaque iure iusto laboriosam magnam magni minima nam nesciunt nisi odit optio pariatur, perferendis possimus quisquam repellendus rerum unde voluptas."
            />
            <KanbanItem
              title="Change clothes"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eum in ipsum itaque iure iusto laboriosam magnam magni minima nam nesciunt nisi odit optio pariatur, perferendis possimus quisquam repellendus rerum unde voluptas."
            />
            <KanbanItem
              title="Change clothes"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eum in ipsum itaque iure iusto laboriosam magnam magni minima nam nesciunt nisi odit optio pariatur, perferendis possimus quisquam repellendus rerum unde voluptas."
            />
            <li className="kanban__add">+</li>
          </ul>
        </div>
        <div className="kanban__column">
          <div className="kanban__header">
            <span className="material-symbols-outlined" style={{color: "yellow"}}>radio_button_checked</span>
            <h3 className="kanban__name">In progress</h3>
          </div>
          <ul className="list-reset kanban__list">
            <KanbanItem
              title="Change clothes"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eum in ipsum itaque iure iusto laboriosam magnam magni minima nam nesciunt nisi odit optio pariatur, perferendis possimus quisquam repellendus rerum unde voluptas."
            />
            <KanbanItem
              title="Change clothes"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eum in ipsum itaque iure iusto laboriosam magnam magni minima nam nesciunt nisi odit optio pariatur, perferendis possimus quisquam repellendus rerum unde voluptas."
            />
          </ul>
        </div>
        <div className="kanban__column">
          <div className="kanban__header">
            <span className="material-symbols-outlined" style={{color: "green"}}>expand_circle_down</span>
            <h3 className="kanban__name">Done</h3>
          </div>
          <ul className="list-reset kanban__list">
            <KanbanItem
              title="Change clothes"
              description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eum in ipsum itaque iure iusto laboriosam magnam magni minima nam nesciunt nisi odit optio pariatur, perferendis possimus quisquam repellendus rerum unde voluptas."
            />
          </ul>
        </div>
      </div>
    </section>
  )
}
