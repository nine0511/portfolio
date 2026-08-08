const works = [
  {
    number: "01",
    title: "スマート配達",
    subtitle: "Delivery System / Team Project",
    description:
      "再配達を減らすことを目指した、ドライバー目線の柔軟な配送支援システム。",
    tags: ["AWS", "Web", "UI/UX", "Team"],
  },
  {
    number: "02",
    title: "FlipilF",
    subtitle: "Game / Unity",
    description:
      "『何でも入れ替える』ことを軸にしたゲーム作品。企画から実装までを行いました。",
    tags: ["Unity", "C#", "Game Design"],
  },
  {
    number: "03",
    title: "中華統一 ～英雄札譚～",
    subtitle: "Game Planning",
    description:
      "デッキ構築ローグライクと中国史を組み合わせたゲーム企画。",
    tags: ["Planning", "Level Design", "Scenario"],
  },
];

const skills = [
  "Unity / C#",
  "Python",
  "JavaScript / TypeScript",
  "HTML / CSS",
  "Git / GitHub",
  "AWS",
  "Game Planning",
  "UI / UX",
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="トップへ">
          NINE0511
        </a>
        <nav aria-label="メインナビゲーション">
          <a href="#works">WORK</a>
          <a href="#profile">PROFILE</a>
          <a href="#skills">SKILLS</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </header>

      <section id="top" className="hero section-shell">
        <p className="eyebrow">PORTFOLIO / 2026</p>
        <h1>
          DESIGNING
          <br />
          <span>EXPERIENCES.</span>
        </h1>
        <div className="hero-bottom">
          <p>
            ゲームとWebを中心に、企画・実装・UI/UXまで。
            <br />
            「遊びやすさ」と「伝わりやすさ」を考えてものづくりをしています。
          </p>
          <a className="scroll-link" href="#works">
            SCROLL ↓
          </a>
        </div>
      </section>

      <section id="works" className="section-shell section-block">
        <div className="section-heading">
          <p className="eyebrow">SELECTED WORKS</p>
          <h2>WORK</h2>
        </div>

        <div className="works-list">
          {works.map((work) => (
            <article className="work-card" key={work.number}>
              <div className="work-number">{work.number}</div>
              <div className="work-main">
                <p className="work-subtitle">{work.subtitle}</p>
                <h3>{work.title}</h3>
                <p className="work-description">{work.description}</p>
                <ul className="tag-list" aria-label={`${work.title} の技術・分野`}>
                  {work.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div className="work-arrow" aria-hidden="true">
                ↗
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="profile" className="section-shell section-block profile-grid">
        <div className="section-heading sticky-heading">
          <p className="eyebrow">ABOUT ME</p>
          <h2>PROFILE</h2>
        </div>
        <div className="profile-copy">
          <p className="lead">
            情報科学を学びながら、ゲーム制作・Web開発・チーム開発に取り組んでいます。
          </p>
          <p>
            企画だけ、実装だけに閉じず、ユーザーがどう感じるかまで考えて形にすることを大切にしています。
            特にゲームではレベルデザインやUI、システム設計に関心があります。
          </p>
          <dl className="profile-facts">
            <div>
              <dt>FIELD</dt>
              <dd>Game Design / Web / UI・UX</dd>
            </div>
            <div>
              <dt>BASED IN</dt>
              <dd>Hiroshima, Japan</dd>
            </div>
            <div>
              <dt>FOCUS</dt>
              <dd>Planning × Implementation</dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="skills" className="section-shell section-block">
        <div className="section-heading">
          <p className="eyebrow">TOOLS & FIELDS</p>
          <h2>SKILLS</h2>
        </div>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div className="skill-item" key={skill}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{skill}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-shell contact-inner">
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>
            LET&apos;S MAKE
            <br />
            SOMETHING GOOD.
          </h2>
          <div className="contact-links">
            <a href="https://github.com/nine0511" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
          <footer>
            <span>© 2026 nine0511</span>
            <a href="#top">BACK TO TOP ↑</a>
          </footer>
        </div>
      </section>
    </main>
  );
}
