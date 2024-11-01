import {Photo} from "./Photo"
import {Action} from "./Action"
import {Loader} from "@/components/Loader/Loader"
import {useAuthContext} from "@/context/authContext"
import "./Account.scss"

export const Account = () => {
  const { user, isLoading } = useAuthContext()

  if (isLoading) {
    return <Loader />
  }

  return (
    <section className="account">
      <Photo photoURL={user.photoURL} />
      <div className="user">
        <h2 className="title--lg user__name">{user.displayName}</h2>
        <div className="account__actions">
          <Action
            type="email"
            hasInput>
            Change e-mail
          </Action>
          <Action
            type="password"
            hasInput>
            Change password
          </Action>
          <Action
            type="logout">
            Log out
          </Action>
        </div>
      </div>
    </section>
  )
}
