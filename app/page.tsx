"use client";

import { useState } from "react";

const demoImage = (title: string, subtitle: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
      <rect width="1200" height="700" fill="#f3f3f3"/>
      <rect x="42" y="42" width="1116" height="616" rx="24" fill="#fff" stroke="#111" stroke-width="5"/>
      <rect x="88" y="90" width="310" height="520" rx="28" fill="#efefef" stroke="#bdbdbd" stroke-width="3"/>
      <rect x="445" y="90" width="310" height="520" rx="28" fill="#f8f8f8" stroke="#bdbdbd" stroke-width="3"/>
      <rect x="802" y="90" width="310" height="520" rx="28" fill="#efefef" stroke="#bdbdbd" stroke-width="3"/>
      <rect x="128" y="155" width="230" height="55" rx="12" fill="#111"/>
      <rect x="485" y="155" width="230" height="55" rx="12" fill="#111"/>
      <rect x="842" y="155" width="230" height="55" rx="12" fill="#111"/>
      <rect x="128" y="250" width="230" height="230" rx="18" fill="#d8d8d8"/>
      <rect x="485" y="250" width="230" height="230" rx="18" fill="#e5e5e5"/>
      <rect x="842" y="250" width="230" height="230" rx="18" fill="#d8d8d8"/>
      <text x="600" y="352" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="800" fill="#111">${title}</text>
      <text x="600" y="410" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#666">${subtitle}</text>
      <text x="600" y="565" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#888">DEMO PROJECT VISUAL</text>
    </svg>
  `)}`;

const works = [
  {
    number: "01",
    title: "スマート配達",
    type: "WEB / AI",
    status: "AWARD",
    year: "2026",
    subtitle: "再配達を減らす、ドライバー目線の配送支援システム。",
    description:
      "配達員と受取人の双方が柔軟に予定を調整できる仕組みにより、再配達を減らすことを目指したチーム開発です。実装、自治体ヒアリング、LP制作を担当しました。",
    tags: ["AWS", "Team Development", "UI/UX"],
    image: demoImage("SMART DELIVERY", "Delivery Support System"),
  },
  {
    number: "02",
    title: "FlipilF",
    type: "GAME",
    status: "UNITY",
    year: "2025",
    subtitle: "『何でも入れ替える』を軸にしたゲーム作品。",
    description:
      "オブジェクト同士を入れ替えるルールを中心に、プレイヤーが状況を読み替えながら進むゲームとして企画・制作しました。ゲームデザインと実装の両面を担当しています。",
    tags: ["Unity", "C#", "Game Design"],
    image: demoImage("FLIPILF", "Unity Game Project"),
  },
  {
    number: "03",
    title: "中華統一 ～英雄札譚～",
    type: "PLANNING",
    status: "GAME",
    year: "2026",
    subtitle: "デッキ構築ローグライク × 中国史のゲーム企画。",
    description:
      "英雄や戦術をカードとして組み合わせながら中国統一を目指す企画です。リスクとリターンの選択、歴史人物による戦況変化、周回性を重視して設計しました。",
    tags: ["Planning", "Level Design", "Scenario"],
    image: demoImage("HEROIC CARDS", "Deck-building Roguelike"),
  },
];

const skillGroups = [
  {
    title: "制作で頻繁に使用",
    skills: [
      { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" },
      { name: "Unity", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
    ],
  },
  {
    title: "使って制作経験あり",
    skills: [
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
    ],
  },
  {
    title: "講義・研究で触れたことがある",
    skills: [
      { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
    ],
  },
];

export default function Home() {
  const [activeWork, setActiveWork] = useState(0);
  const previousWork = () => setActiveWork((current) => (current - 1 + works.length) % works.length);
  const nextWork = () => setActiveWork((current) => (current + 1) % works.length);

  return (
    <main>
      <style>{`
        .work-carousel-wrap { position: relative; margin-top: 24px; padding: 18px 0 72px; overflow: hidden; }
        .work-carousel-stage { position: relative; min-height: 710px; display: flex; align-items: center; justify-content: center; }
        .work-slide { position: absolute; width: min(820px, 72vw); min-height: 620px; padding: 30px 32px 28px; background: #fff; border: 4px solid #0a0a0a; border-radius: 30px; box-shadow: 20px 20px 0 #0a0a0a; transition: transform .45s ease, opacity .45s ease, filter .45s ease; }
        .work-slide.active { z-index: 3; transform: translateX(0) scale(1); opacity: 1; filter: none; }
        .work-slide.prev { z-index: 1; transform: translateX(-66%) scale(.83); opacity: .22; filter: grayscale(1); }
        .work-slide.next { z-index: 1; transform: translateX(66%) scale(.83); opacity: .22; filter: grayscale(1); }
        .work-slide.hidden { z-index: 0; transform: scale(.76); opacity: 0; pointer-events: none; }
        .work-slide-top { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 10px; }
        .work-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; font-weight: 800; font-size: 13px; letter-spacing: .05em; }
        .work-index { font-family: monospace; font-size: 15px; }
        .work-pill { padding: 7px 11px; border: 2px solid #0a0a0a; border-radius: 4px; background: #0a0a0a; color: #fff; }
        .work-status { padding: 6px 10px; border: 2px solid #0a0a0a; border-radius: 4px; background: #fff; color: #0a0a0a; }
        .work-year { color: #9a9a9a; font-family: monospace; font-weight: 800; font-size: 17px; }
        .work-slide h3 { margin: 4px 0 2px; font-size: clamp(38px, 5vw, 68px); line-height: .95; letter-spacing: -.06em; }
        .work-slide-subtitle { margin: 0 0 16px; color: #777; font-weight: 700; font-size: 16px; }
        .work-thumb { width: 100%; aspect-ratio: 16 / 8.6; object-fit: cover; display: block; border: 3px solid #0a0a0a; border-radius: 18px; background: #f3f3f3; }
        .work-slide-description { margin: 18px 0 14px; color: #242424; font-size: 17px; line-height: 1.8; font-weight: 600; }
        .work-slide-footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; padding-top: 14px; border-top: 1px dashed #cfcfcf; }
        .work-hashtags { margin: 0; font-size: 13px; line-height: 1.7; font-weight: 800; }
        .view-more { white-space: nowrap; font-size: 15px; font-weight: 900; letter-spacing: .04em; }
        .carousel-arrow { position: absolute; z-index: 5; top: 50%; width: 58px; height: 58px; display: grid; place-items: center; border: 3px solid #0a0a0a; border-radius: 50%; background: #fff; color: #0a0a0a; font-size: 28px; cursor: pointer; transform: translateY(-50%); transition: background .2s ease, color .2s ease, transform .2s ease; }
        .carousel-arrow:hover { background: #0a0a0a; color: #fff; transform: translateY(-50%) scale(1.06); }
        .carousel-arrow.left { left: max(0px, calc(50% - 570px)); }
        .carousel-arrow.right { right: max(0px, calc(50% - 570px)); }
        .carousel-dots { display: flex; justify-content: center; gap: 10px; margin-top: 2px; }
        .carousel-dot { width: 10px; height: 10px; padding: 0; border: 2px solid #0a0a0a; border-radius: 999px; background: #fff; cursor: pointer; }
        .carousel-dot.active { width: 34px; background: #0a0a0a; }

        .skills-showcase { padding: 110px 0 120px; background: #fff; border-top: 1px solid #dfdfdf; border-bottom: 1px solid #dfdfdf; }
        .skills-inner { text-align: center; }
        .skills-title { margin: 0; font-size: clamp(34px, 4vw, 52px); font-weight: 800; letter-spacing: -0.045em; }
        .skill-groups { width: min(100%, 980px); margin: 48px auto 0; display: grid; gap: 62px; }
        .skill-group h3 { margin: 0 0 24px; font-size: clamp(20px, 2.2vw, 28px); font-weight: 800; letter-spacing: -0.03em; }
        .skill-logo-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(24px, 4vw, 46px); }
        .skill-logo-item { position: relative; width: clamp(58px, 7vw, 78px); height: clamp(58px, 7vw, 78px); display: grid; place-items: center; transition: transform .18s ease, filter .18s ease; }
        .skill-logo-item:hover { transform: translateY(-5px) scale(1.05); filter: drop-shadow(0 9px 12px rgba(20,20,20,.10)); }
        .skill-logo-item img { width: 100%; height: 100%; object-fit: contain; display: block; filter: none !important; opacity: 1 !important; }
        .skill-logo-item span { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

        @media (max-width: 900px) {
          .work-carousel-stage { min-height: 650px; }
          .work-slide { width: min(760px, 82vw); min-height: 570px; padding: 24px; }
          .work-slide.prev { transform: translateX(-72%) scale(.78); }
          .work-slide.next { transform: translateX(72%) scale(.78); }
          .carousel-arrow.left { left: 4px; }
          .carousel-arrow.right { right: 4px; }
        }

        @media (max-width: 700px) {
          .work-carousel-wrap { padding-bottom: 54px; }
          .work-carousel-stage { min-height: 620px; }
          .work-slide { width: calc(100% - 18px); min-height: 550px; border-width: 3px; border-radius: 22px; box-shadow: 10px 10px 0 #0a0a0a; padding: 20px; }
          .work-slide.prev, .work-slide.next { opacity: 0; transform: scale(.92); }
          .work-slide-top { align-items: flex-start; }
          .work-meta { gap: 7px; font-size: 11px; }
          .work-year { font-size: 14px; }
          .work-slide h3 { font-size: clamp(34px, 11vw, 50px); }
          .work-thumb { border-width: 2px; border-radius: 12px; }
          .work-slide-description { font-size: 14px; }
          .work-slide-footer { align-items: flex-start; flex-direction: column; gap: 8px; }
          .carousel-arrow { top: auto; bottom: -3px; width: 46px; height: 46px; font-size: 22px; transform: none; }
          .carousel-arrow:hover { transform: scale(1.06); }
          .carousel-arrow.left { left: 18px; }
          .carousel-arrow.right { right: 18px; }
          .skills-showcase { padding: 82px 0 90px; }
          .skill-groups { margin-top: 38px; gap: 50px; }
          .skill-logo-row { gap: 22px 28px; }
        }
      `}</style>

      <header className="site-header">
        <a className="logo" href="#top" aria-label="トップへ">NINE0511</a>
        <nav aria-label="メインナビゲーション">
          <a href="#works">WORK</a><a href="#profile">PROFILE</a><a href="#skills">SKILLS</a><a href="#contact">CONTACT</a>
        </nav>
      </header>

      <section id="top" className="hero section-shell">
        <p className="eyebrow">PORTFOLIO / 2026</p>
        <h1>DESIGNING<br /><span>EXPERIENCES.</span></h1>
        <div className="hero-bottom">
          <p>ゲームとWebを中心に、企画・実装・UI/UXまで。<br />「遊びやすさ」と「伝わりやすさ」を考えてものづくりをしています。</p>
          <a className="scroll-link" href="#works">SCROLL ↓</a>
        </div>
      </section>

      <section id="works" className="section-shell section-block">
        <div className="section-heading"><p className="eyebrow">SELECTED WORKS</p><h2>WORK</h2></div>
        <div className="work-carousel-wrap">
          <div className="work-carousel-stage">
            {works.map((work, index) => {
              const previous = (activeWork - 1 + works.length) % works.length;
              const next = (activeWork + 1) % works.length;
              const state = index === activeWork ? "active" : index === previous ? "prev" : index === next ? "next" : "hidden";
              return (
                <article className={`work-slide ${state}`} key={work.number} aria-hidden={index !== activeWork}>
                  <div className="work-slide-top">
                    <div className="work-meta"><span className="work-index">{work.number} //</span><span className="work-pill">{work.type}</span><span className="work-status">● {work.status}</span></div>
                    <span className="work-year">{work.year}</span>
                  </div>
                  <h3>{work.title}</h3>
                  <p className="work-slide-subtitle">{work.subtitle}</p>
                  <img className="work-thumb" src={work.image} alt={`${work.title} のデモサムネイル`} />
                  <p className="work-slide-description">{work.description}</p>
                  <div className="work-slide-footer">
                    <p className="work-hashtags">{work.tags.map((tag) => `#${tag.replaceAll(" ", "")}`).join("  ")}</p>
                    <span className="view-more">VIEW MORE →</span>
                  </div>
                </article>
              );
            })}
            <button className="carousel-arrow left" type="button" onClick={previousWork} aria-label="前の作品">←</button>
            <button className="carousel-arrow right" type="button" onClick={nextWork} aria-label="次の作品">→</button>
          </div>
          <div className="carousel-dots" aria-label="作品を選択">
            {works.map((work, index) => <button key={work.number} type="button" className={`carousel-dot ${index === activeWork ? "active" : ""}`} onClick={() => setActiveWork(index)} aria-label={`${work.title}を表示`} />)}
          </div>
        </div>
      </section>

      <section id="profile" className="section-shell section-block profile-grid">
        <div className="section-heading sticky-heading"><p className="eyebrow">ABOUT ME</p><h2>PROFILE</h2></div>
        <div className="profile-copy">
          <p className="lead">情報科学を学びながら、ゲーム制作・Web開発・チーム開発に取り組んでいます。</p>
          <p>企画だけ、実装だけに閉じず、ユーザーがどう感じるかまで考えて形にすることを大切にしています。特にゲームではレベルデザインやUI、システム設計に関心があります。</p>
          <dl className="profile-facts"><div><dt>FIELD</dt><dd>Game Design / Web / UI・UX</dd></div><div><dt>BASED IN</dt><dd>Hiroshima, Japan</dd></div><div><dt>FOCUS</dt><dd>Planning × Implementation</dd></div></dl>
        </div>
      </section>

      <section id="skills" className="skills-showcase">
        <div className="section-shell skills-inner">
          <h2 className="skills-title">スキルセット</h2>
          <div className="skill-groups">
            {skillGroups.map((group) => <section className="skill-group" key={group.title}><h3>{group.title}</h3><div className="skill-logo-row">{group.skills.map((skill) => <div className="skill-logo-item" key={skill.name} title={skill.name} aria-label={skill.name}><img src={skill.icon} alt="" loading="lazy" /><span>{skill.name}</span></div>)}</div></section>)}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section"><div className="section-shell contact-inner"><p className="eyebrow">GET IN TOUCH</p><h2>LET&apos;S MAKE<br />SOMETHING GOOD.</h2><div className="contact-links"><a href="https://github.com/nine0511" target="_blank" rel="noreferrer">GitHub ↗</a></div><footer><span>© 2026 nine0511</span><a href="#top">BACK TO TOP ↑</a></footer></div></section>
    </main>
  );
}
