import dayjs from "dayjs"

export const getLastFourMonths = () => {
  const monthNames = []

  for (let i = 0; i < 4; i++) {
    monthNames.push(dayjs().subtract(i, 'months').format('MMM'))
  }

  // Since the current month will be the first item
  return monthNames.toReversed()
}

export const getDefaultKanbanData = () => {
  return getLastFourMonths().map((month) => ({ name: month, stats: { todo: 0, inProgress: 0, done: 0 } }))
}

export const isActivePath = (itemPath, currentPath) => {
  return itemPath === currentPath
    || (itemPath === "/list" && currentPath.startsWith("/list"))
}

export const handleEnter = (cb) => {
  return (event) => {
    if (event.key === "Enter") {
      cb()
    }
  }
}

export const defaultPhotoURL = "https://firebasestorage.googleapis.com/v0/b/react-todo-eab1e.appspot.com/o/frlIf.png?alt=media&token=6434c571-c0dd-4f84-bc68-2f11a3d197ad"
