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

const skillGroups = [
  {
    title: "制作で頻繁に使用",
    skills: [
      {
        name: "C#",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
      },
      {
        name: "Unity",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg",
      },
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
      },
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      },
    ],
  },
  {
    title: "使って制作経験あり",
    skills: [
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        name: "HTML5",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
      },
      {
        name: "CSS3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
      },
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      },
    ],
  },
  {
    title: "講義・研究で触れたことがある",
    skills: [
      {
        name: "C",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
      },
      {
        name: "Java",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
      },
    ],
  },
];

export default function Home() {
  return (
    <main>
      <style>{`
        .skills-showcase {
          padding: 110px 0 120px;
          background:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,.72), transparent 31%),
            radial-gradient(circle at 78% 38%, rgba(255,255,255,.58), transparent 34%),
            #eeebf2;
        }

        .skills-inner {
          text-align: center;
        }

        .skills-title {
          margin: 0;
          font-size: clamp(34px, 4vw, 52px);
          font-weight: 800;
          letter-spacing: -0.045em;
        }

        .skill-groups {
          width: min(100%, 980px);
          margin: 48px auto 0;
          display: grid;
          gap: 62px;
        }

        .skill-group h3 {
          margin: 0 0 24px;
          font-size: clamp(20px, 2.2vw, 28px);
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .skill-logo-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(24px, 4vw, 46px);
        }

        .skill-logo-item {
          position: relative;
          width: clamp(58px, 7vw, 78px);
          height: clamp(58px, 7vw, 78px);
          display: grid;
          place-items: center;
          transition: transform .18s ease, filter .18s ease;
        }

        .skill-logo-item:hover {
          transform: translateY(-5px) scale(1.05);
          filter: drop-shadow(0 9px 12px rgba(20,20,20,.10));
        }

        .skill-logo-item img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        .skill-logo-item span {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 700px) {
          .skills-showcase {
            padding: 82px 0 90px;
          }

          .skill-groups {
            margin-top: 38px;
            gap: 50px;
          }

          .skill-logo-row {
            gap: 22px 28px;
          }
        }

        @media (max-width: 420px) {
          .skill-logo-item {
            width: 54px;
            height: 54px;
          }

          .skill-group h3 {
            margin-bottom: 20px;
          }
        }
      `}</style>

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

      <section id="skills" className="skills-showcase">
        <div className="section-shell skills-inner">
          <h2 className="skills-title">スキルセット</h2>

          <div className="skill-groups">
            {skillGroups.map((group) => (
              <section className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="skill-logo-row">
                  {group.skills.map((skill) => (
                    <div
                      className="skill-logo-item"
                      key={skill.name}
                      title={skill.name}
                      aria-label={skill.name}
                    >
                      <img src={skill.icon} alt="" loading="lazy" />
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
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
