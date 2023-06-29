import {useState} from "react"
import {doc, setDoc} from "firebase/firestore/lite"
import {useMountTransition} from "../../hooks/useMountTransition"
import {Notification} from "../../components/Notification/Notification"
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
  // For notification
  const [isMounted, setIsMounted] = useState(false)
  const hasTransitionedIn = useMountTransition(isMounted, 500)
  // Loader
  const [isLoading, setIsLoading] = useState(false)

  const changePhoto = async (event) => {
    setIsLoading(true)
    const file = event.target.files[0]

    try {
      const base64 = await convertBase64(file)

      setDoc(
        doc(db, "users", user.email),
        { avatar: base64 },
        { merge: true }
      )

      setIsLoading(false)
      setIsMounted(false)
      setUser({...user, avatar: base64})
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="photo">
      {(isMounted || hasTransitionedIn) && (
        <Notification
          title="📸 Your request to change avatar"
          text="Upload your photo by choosing a file (max size is 1MB)"
          hasTransitionedIn={hasTransitionedIn}
          isMounted={isMounted}
          toggle={() => setIsMounted(!isMounted)}
        >
          {isLoading ? <Loader /> : (
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
          )}
        </Notification>
      )}
      <div className="photo__image">
        <img src={user.avatar} alt="Profile picture" />
      </div>
      <button className="btn-reset photo__change" onClick={() => setIsMounted(true)}>
        Change
      </button>
    </div>
  )
}
