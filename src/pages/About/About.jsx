import "./About.scss"

export const About = () => {
  return (
    <section className="about">
      <div></div>
      <div className="about__text">
        <p>Created by Volodymyr Doskochynskyi</p>
        <p>To-Do application with authorization and routing. There are both List and Kanban available types of To-dos.</p>
        <p>Github: <a href="https://github.com/dx1ded" target="_blank" rel="noreferrer">@dx1ded</a></p>
      </div>
      <p className="about__copyright">&copy; 2024 Volodymyr Doskochynskyi</p>
    </section>
  )
}
