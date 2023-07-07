import {useState} from "react"
import {updateDoc} from "firebase/firestore/lite"
import {getUserDoc} from "../../getUserDoc"
import {useNotification} from "../../components/Notification/useNotification"
import {Loader} from "../../components/Loader/Loader"

function convertBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => resolve(fileReader.result)
    fileReader.onerror = (error) => reject(error)
  })
}

export const Photo = ({ user, setUser, db }) => {
  const [api, contextHolder] = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  let id

  const clickHandler = () => {
    id = api.add({
      title: "📸 Your request to change avatar",
      text: "Upload your photo by choosing a file (max size is 1MB)",
      children: isLoading ? <Loader /> : (
          <div className="file">
            <label className="file__label">
              Choose File
              <input
                type="file"
                className="file__input"
                accept=".png,.jpeg,.jpg,.webp"
                onChange={changePhoto}
              />
            </label>
          </div>
        )
    })
  }

  const changePhoto = async (event) => {
    setIsLoading(true)
    const file = event.target.files[0]

    try {
      const base64 = await convertBase64(file)
      const doc = await getUserDoc(db, user.email)

      await updateDoc(doc.ref, { avatar: base64 })

      setIsLoading(false)
      api.remove(id)
      setUser({...user, avatar: base64})
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
