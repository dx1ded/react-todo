import {useDebouncedCallback} from "use-debounce"
import {updateDoc} from "firebase/firestore/lite"
import {useNotification} from "../components/Notification/useNotification"

const DEBOUNCED_INTERVAL = 3000

export const useSaveDebounced = (doc, fieldName) => {
  const [api, contextHolder] = useNotification()
  const saveData = useDebouncedCallback(
    (data) => {
      updateDoc(doc, { [fieldName]: data })
        .then(() => api.add({
          title: "👍 Saved",
          text: "Your data has been saved successfully!",
          duration: 5000
        }))
    },
    DEBOUNCED_INTERVAL
  )

  return [saveData, contextHolder, api]
}
