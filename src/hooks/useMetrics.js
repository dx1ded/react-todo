import {useState, useEffect, useCallback} from "react"
import {updateDoc} from "firebase/firestore/lite"

// type -> "kanban" | "list"
export const useMetrics = (doc, type) => {
  const [shouldSave, setShouldSave] = useState(false)
  const [metrics, setMetrics] = useState([])

  useEffect(() => {
    if (shouldSave) {
      updateDoc(doc, { [`metrics.${type}`]: metrics })
        .then(() => setShouldSave(false))
    }
  }, [shouldSave, metrics, setShouldSave, doc, type])

  // value -> number
  const updateMetricsBy = useCallback((field, value) => {
    setMetrics((prevState) => {
      const newState = prevState.map(
        (period, i) => i === prevState.length - 1
          ? {...prevState.at(-1), [field]: prevState.at(-1)[field] + value }
          : period
      )

      return newState
    })
  }, [setMetrics])

  const saveMetrics = () => setShouldSave(true)

  return [saveMetrics, updateMetricsBy, setMetrics]
}
