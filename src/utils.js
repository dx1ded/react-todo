// amount<max> -> 12
export const getLastMonths = (amount) => {
  const currentMonth = new Date().getMonth()
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]

  return Array(amount)
    .fill(null)
    .reduce((acc, _, i) =>
      (acc.push(months.at(currentMonth - i)), acc),
      []
    )
}

export const isActivePath = (itemPath, currentPath) => {
  return itemPath === currentPath
    || itemPath === "/list" && currentPath.startsWith("/list")
}
