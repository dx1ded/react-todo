import {useState} from "react"
import {updateProfile, getAuth} from "firebase/auth"
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage"
import {useAuthContext} from "@/context/authContext"
import {useNotification} from "@/components/Notification/useNotification"
import {Loader} from "@/components/Loader/Loader"

export const Photo = ({ photoURL }) => {
  const [api, contextHolder] = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const {setUser} = useAuthContext()
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
      const storage = getStorage()
      const currentUser = getAuth().currentUser

      const photoRef = ref(storage, `profilePictures/${currentUser.uid}`)
      await uploadBytes(photoRef, file)

      const photoURL = await getDownloadURL(photoRef)

      await updateProfile(currentUser, { photoURL })

      setIsLoading(false)
      setUser((prev) => ({ ...prev, photoURL }))

      api.remove(id)
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="photo">
      {contextHolder}
      <div className="photo__image">
        <img src={photoURL} alt="Profile picture" />
      </div>
      <button className="btn-reset photo__change" onClick={clickHandler}>
        Change
      </button>
    </div>
  )
}
