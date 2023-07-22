import {getLastMonths} from "../../utils"

export function createOptions(text) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text
      }
    }
  }
}

export function createBarData(datasets) {
  const COLORS = ["#4EA8DE", "#5E60CE", "#F2F2F2"]

  return {
    labels: getLastMonths(4).reverse(),
    datasets: datasets.map((dataset, i) => ({
      ...dataset,
      backgroundColor: COLORS[i]
    }))
  }
}

export function createPieData(labels, datasets) {
  const COLORS = ["#CB7777", "#77C0CB", "#7CCB77"]

  return {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: COLORS.slice(0, dataset.data.length)
    }))
  }
}
