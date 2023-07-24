import {useUser} from "@hooks/useUser"
import {Photo} from "./Photo"
import {Action} from "./Action"
import {Loader} from "@components/Loader/Loader"
import "./Account.scss"

export const Account = () => {
  const [user, loading, doc] = useUser()

  if (loading) {
    return <Loader />
  }

  return (
    <section className="account">
      <Photo user={user} doc={doc} />
      <div className="user">
        <h2 className="title--lg user__name">{user.fullName}</h2>
        <h5 className="text--sm user__nickname">@{user.username}</h5>
        <div className="account__actions">
          <Action
            type="email"
            hasInput
            doc={doc}>
            Change e-mail
          </Action>
          <Action
            type="password"
            hasInput
            doc={doc}>
            Change password
          </Action>
          <Action
            type="quit">
            Quit
          </Action>
        </div>
      </div>
    </section>
  )
}
