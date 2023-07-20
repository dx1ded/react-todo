import {useDebouncedCallback} from "use-debounce"
import {updateDoc} from "firebase/firestore/lite"
import {useNotification} from "../components/Notification/useNotification"

const DEBOUNCED_INTERVAL = 1500

export const useSaveDebounced = (doc, fieldName) => {
  const [api, contextHolder] = useNotification()
  const saveData = useDebouncedCallback(
    // cb?:
    (data, cb) => {
      updateDoc(doc, fieldName ? { [fieldName]: data } : data)
        .then(() => {
          api.add({
            title: "👍 Saved",
            text: "Your data has been saved successfully!",
            duration: 5000
          })

          if (cb) cb()
        })
    },
    DEBOUNCED_INTERVAL
  )

  return [saveData, contextHolder, api]
}
