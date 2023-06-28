import {useState} from "react"
import {doc, setDoc} from "firebase/firestore/lite"
import {Modal} from "../../components/Modal/Modal"
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
  // For modal menu
  const [isActive, setIsActive] = useState(false)
  // Loader
  const [isLoading, setIsLoading] = useState(false)

  const clickHandler = () => {
    setIsActive(true)
  }

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
      setIsActive(false)
      setUser({...user, avatar: base64})
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="photo">
      <Modal isActive={isActive} toggle={setIsActive}>
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
      </Modal>
      <div className="photo__image">
        <img src={user.avatar} alt="Profile picture" />
      </div>
      <button className="btn-reset photo__change" onClick={clickHandler}>Change</button>
    </div>
  )
}
