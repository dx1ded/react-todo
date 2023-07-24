import {useState} from "react"
import {updateDoc} from "firebase/firestore"
import {useNotification} from "@components/Notification/useNotification"
import {Loader} from "@components/Loader/Loader"

function convertBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => resolve(fileReader.result)
    fileReader.onerror = (error) => reject(error)
  })
}

export const Photo = ({ user, doc }) => {
  const [api, contextHolder] = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  let id

  const clickHandler = () => {
    id = api.add({
      title: "📸 Your request to change avatar",
      text: "Upload your photo by choosing a file (max size is 1MB)",
      duration: 15000,
      children: isLoading ? <Loader /> : (
          <div className="notification__container">
            <label className="notification__button">
              Choose File
              <input
                type="file"
                style={{ display: "none" }}
                accept=".png,.jpeg,.jpg,.webp"
                onChange={changePhoto}
              />
            </label>
          </div>
        )
    })
  }

  const changePhoto = async (event) => {
    const file = event.target.files[0]
    const sizeInMb = file.size / 1024 / 1024

    if (sizeInMb >= 1) {
      return api.add({
        title: "⚖️ File cannot exceed 1 MB",
        text: "Please choose another file which size is less than 1 MB!",
        duration: 4000
      })
    }

    setIsLoading(true)

    try {
      const base64 = await convertBase64(file)

      await updateDoc(doc.ref, { avatar: base64 })

      setIsLoading(false)
      api.remove(id)

      user.avatar = base64
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="photo">
      {contextHolder}
      <div className="photo__image">
        <img src={user.avatar} alt="Profile picture" />
      </div>
      <button className="btn-reset photo__change" onClick={clickHandler}>
        Change
      </button>
    </div>
  )
}
