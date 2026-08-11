"use client";

import { useEffect, useMemo, useState } from "react";
import contentData from "../data/content.json";
import AdminPanel from "./components/AdminPanel";

const demoImage = (title: string, subtitle: string, variant = 1) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
      <rect width="1200" height="700" fill="#edf4ef"/>
      <rect x="42" y="42" width="1116" height="616" rx="24" fill="#fff" stroke="#315f48" stroke-width="5"/>
      ${variant === 1 ? `<rect x="90" y="100" width="300" height="500" rx="28" fill="#e3ece6"/><rect x="450" y="100" width="300" height="500" rx="28" fill="#f7faf8"/><rect x="810" y="100" width="300" height="500" rx="28" fill="#e3ece6"/>` : variant === 2 ? `<rect x="95" y="95" width="1010" height="105" rx="20" fill="#315f48"/><rect x="95" y="245" width="310" height="345" rx="22" fill="#dfe9e2"/><rect x="445" y="245" width="310" height="345" rx="22" fill="#f4f7f5"/><rect x="795" y="245" width="310" height="345" rx="22" fill="#dfe9e2"/>` : `<rect x="95" y="100" width="1010" height="365" rx="24" fill="#e5ede7"/><rect x="95" y="505" width="300" height="95" rx="18" fill="#315f48"/><rect x="450" y="505" width="300" height="95" rx="18" fill="#cbdacf"/><rect x="805" y="505" width="300" height="95" rx="18" fill="#edf3ef"/>`}
      <text x="600" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#111">${title}</text>
      <text x="600" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#315f48">${subtitle}</text>
    </svg>
  `)}`;

const galleryImage = (title: string, label: string, variant: number) => demoImage(title, label, variant);

type Work = (typeof contentData.works)[number] & { image: string; gallery: string[] };
type Product = (typeof contentData.products)[number] & { image: string };
type PdfPreview = { url: string; label: string } | null;

type ProfileContent = {
  lead: string;
  description: string;
  field: string;
  basedIn: string;
  focus: string;
  researchTitle: string;
  researchDescription: string;
  researchTags: string[];
  hobbyTags: string[];
  hobbyDescription: string;
};

const defaultProfile: ProfileContent = {
  lead: "情報科学を学びながら、ゲーム制作・Web開発・チーム開発に取り組んでいます。",
  description: "企画だけ、実装だけに閉じず、ユーザーがどう感じるかまで考えて形にすることを大切にしています。特にゲームではレベルデザインやUI、システム設計に関心があります。",
  field: "Game Design / Web / UI・UX",
  basedIn: "Hiroshima, Japan",
  focus: "Planning × Implementation",
  researchTitle: "閲覧行動ログと認知負荷理論を用いたセキュリティ教育教材の改善",
  researchDescription: "約3,000人規模のセキュリティ教育を対象に、Web教材のスライド滞在時間・再訪や戻り・用語辞書参照・タブ離脱などの閲覧行動ログを取得し、理解度やアンケートと照合しています。読み飛ばしやつまずきの候補を捉え、学習者にとって不必要な認知負荷を抑えるUI/UX改善につなげる研究に取り組んでいます。",
  researchTags: ["Security Education", "UI/UX", "Cognitive Load", "Learning Analytics"],
  hobbyTags: ["ゲーム制作", "創作", "TRPG"],
  hobbyDescription: "ゲームはジャンルを問わず基本なんでも好きです。特に、ルールそのものをハックする遊びや、選択にスリルを感じられるゲームが好きです。",
};

const skillGroups = [
  { title: "制作で頻繁に使用", skills: [
    { name: "C#", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" },
    { name: "Unity", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  ]},
  { title: "使って制作経験あり", skills: [
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
    { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  ]},
  { title: "講義・研究で触れたことがある", skills: [
    { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
    { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" },
  ]},
];

export default function Home() {
  const works = useMemo<Work[]>(() => contentData.works.map((work, index) => ({
    ...work,
    image: work.image || demoImage(work.title.toUpperCase(), work.type, (index % 3) + 1),
    gallery: work.gallery.length ? work.gallery : [galleryImage(work.title, "SCREEN 01", 1), galleryImage(work.title, "SCREEN 02", 2), galleryImage(work.title, "SCREEN 03", 3)],
  })), []);

  const products = useMemo<Product[]>(() => contentData.products.map((product, index) => ({
    ...product,
    image: product.image || demoImage(product.title.toUpperCase(), product.type, (index % 3) + 1),
  })), []);

  const storedProfile = (contentData as typeof contentData & { profile?: Partial<ProfileContent> }).profile;
  const profile: ProfileContent = {
    ...defaultProfile,
    ...(storedProfile ?? {}),
    researchTags: Array.isArray(storedProfile?.researchTags) ? storedProfile.researchTags : defaultProfile.researchTags,
    hobbyTags: Array.isArray(storedProfile?.hobbyTags) ? storedProfile.hobbyTags : defaultProfile.hobbyTags,
  };
  const achievements = contentData.achievements;
  const articles = contentData.articles;
  const [activeWork, setActiveWork] = useState(0);
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const [pdfPreview, setPdfPreview] = useState<PdfPreview>(null);
  const [productFilter, setProductFilter] = useState("ALL");

  const filters = useMemo(() => ["ALL", ...Array.from(new Set(products.map((p) => p.type).filter(Boolean)))], [products]);
  const filteredProducts = productFilter === "ALL" ? products : products.filter((product) => product.type === productFilter);
  const modalWork = selectedWork === null ? null : works[selectedWork];

  useEffect(() => {
    if (selectedWork === null && !pdfPreview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (pdfPreview) setPdfPreview(null);
      else setSelectedWork(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [selectedWork, pdfPreview]);

  const previousWork = () => setActiveWork((current) => (current - 1 + works.length) % works.length);
  const nextWork = () => setActiveWork((current) => (current + 1) % works.length);
  const closeWork = () => { setPdfPreview(null); setSelectedWork(null); };

  return <main>
    <header className="site-header">
      <a className="logo" href="#works">NINE0511</a>
      <nav aria-label="メインナビゲーション"><a href="#works">WORK</a><a href="#profile">PROFILE</a><a href="#achieve">ACHIEVE</a><a href="#products">PRODUCTS</a><a href="#article">ARTICLE</a><a href="#skills">SKILL</a></nav>
    </header>

    <section id="works" className="section-shell section-block">
      <div className="section-heading"><p className="eyebrow">SELECTED WORKS / CASE STUDY</p><h2>WORK</h2></div>
      {works.length > 0 && <div className="work-carousel-wrap"><div className="work-carousel-stage">
        {works.map((work, index) => {
          const previous = (activeWork - 1 + works.length) % works.length;
          const next = (activeWork + 1) % works.length;
          const state = index === activeWork ? "active" : index === previous ? "prev" : index === next ? "next" : "hidden";
          return <article className={`work-slide ${state}`} key={work.id} aria-hidden={index !== activeWork}>
            <div className="work-slide-top"><div className="work-meta"><span className="work-index">{work.number} //</span><span className="work-pill">{work.type}</span><span className="work-status">● {work.status}</span></div><span className="work-year">{work.year}</span></div>
            <h3>{work.title}</h3><p className="work-slide-subtitle">{work.subtitle}</p><img className="work-thumb" src={work.image} alt={`${work.title} のサムネイル`} />
            <p className="work-slide-description">{work.description}</p><div className="work-slide-footer"><p className="work-hashtags">{work.tags.map((tag) => `#${tag.replaceAll(" ", "")}`).join("  ")}</p><button className="view-more" type="button" onClick={() => setSelectedWork(index)}>CASE STUDY →</button></div>
          </article>;
        })}
        {works.length > 1 && <><button className="carousel-arrow left" type="button" onClick={previousWork}>←</button><button className="carousel-arrow right" type="button" onClick={nextWork}>→</button></>}
      </div><div className="carousel-dots">{works.map((work, index) => <button key={work.id} type="button" className={`carousel-dot ${index === activeWork ? "active" : ""}`} onClick={() => setActiveWork(index)} aria-label={`${work.title}を表示`} />)}</div></div>}
    </section>

    <section id="profile" className="section-shell section-block profile-grid">
      <div className="section-heading sticky-heading"><p className="eyebrow">ABOUT ME</p><h2>PROFILE</h2></div>
      <div className="profile-copy"><p className="lead">{profile.lead}</p><p>{profile.description}</p>
        <dl className="profile-facts"><div><dt>FIELD</dt><dd>{profile.field}</dd></div><div><dt>BASED IN</dt><dd>{profile.basedIn}</dd></div><div><dt>FOCUS</dt><dd>{profile.focus}</dd></div></dl>
        <div className="profile-research">
          <p className="eyebrow">RESEARCH</p>
          <h3>{profile.researchTitle}</h3>
          <p>{profile.researchDescription}</p>
          <div className="profile-research-tags">{profile.researchTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <div className="profile-hobby"><p className="eyebrow">HOBBY</p><div className="profile-hobby-tags">{profile.hobbyTags.map((tag) => <span key={tag}>{tag}</span>)}</div><p>{profile.hobbyDescription}</p></div>
      </div>
    </section>

    <section id="achieve" className="achievement-section">
      <div className="section-shell">
        <div className="achievement-heading"><div><p className="eyebrow">MILESTONES / RESULTS</p><h2>ACHIEVE</h2></div><p className="section-description">受賞・コンテスト・チームや組織で生み出した成果をまとめています。</p></div>
        <div className="achievement-list">
          {achievements.map((achievement, index) => {
            const body = <>
              <div className="achievement-year">{achievement.year}</div>
              <div className="achievement-main">
                <div className="achievement-badges"><span className="achievement-category">{achievement.category}</span>{achievement.highlight && <span className="achievement-highlight">{achievement.highlight}</span>}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                {achievement.organization && <div className="achievement-organization">{achievement.organization}</div>}
              </div>
              <div className="achievement-number">{String(index + 1).padStart(2, "0")}{achievement.url ? " ↗" : ""}</div>
            </>;
            return achievement.url ? <a className="achievement-item" key={achievement.id} href={achievement.url} target="_blank" rel="noreferrer">{body}</a> : <article className="achievement-item" key={achievement.id}>{body}</article>;
          })}
        </div>
      </div>
    </section>

    <section id="products" className="products-section"><div className="section-shell">
      <div className="products-heading"><div><p className="eyebrow">ALL PROJECTS</p><h2>PRODUCTS</h2></div><p className="section-description">制作物をカテゴリで絞り込みながら一覧できます。</p></div>
      <div className="product-filters" aria-label="制作物フィルター">{filters.map((filter) => <button key={filter} type="button" className={`product-filter ${productFilter === filter ? "active" : ""}`} onClick={() => setProductFilter(filter)}>{filter}</button>)}</div>
      <div className="products-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image-wrap"><img src={product.image} alt={`${product.title} のサムネイル`} /><span className="product-tech">{product.type}</span></div><div className="product-body"><h3>{product.title}</h3><p>{product.description}</p><div className="product-bottom"><div className="product-meta">制作：{product.year}<br />{product.meta}</div>{product.url ? <a className="product-button" href={product.url} target="_blank" rel="noreferrer">OPEN →</a> : <span className="product-meta">URL未設定</span>}</div></div></article>)}</div>
    </div></section>

    <section id="article" className="articles-section"><div className="section-shell">
      <div className="articles-heading"><div><p className="eyebrow">THINKING / ANALYSIS</p><h2>ARTICLE</h2></div><p className="section-description">制作の結果だけでなく、ゲームデザインや判断の背景を記事として見せます。</p></div>
      <div className="article-grid">{articles.map((article) => {
        const body = <><div className="article-thumb">{article.image ? <img src={article.image} alt="" /> : <span>ARTICLE<br />{article.category}</span>}</div><div className="article-content"><div className="article-topline"><span className="article-category">{article.category}</span><span>{article.date}</span></div><h3>{article.title}</h3><p>{article.description}</p><div className="article-tags">{article.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><div className="article-footerline"><span>{article.readTime || "READ"}</span><span className="article-arrow">↗</span></div></div></>;
        return article.url ? <a className="article-card" key={article.id} href={article.url} target="_blank" rel="noreferrer">{body}</a> : <article className="article-card" key={article.id}>{body}</article>;
      })}</div>
    </div></section>

    <section id="skills" className="skills-showcase"><div className="section-shell skills-inner"><h2 className="skills-title">スキルセット</h2><div className="skill-groups">{skillGroups.map((group) => <section className="skill-group" key={group.title}><h3>{group.title}</h3><div className="skill-logo-row">{group.skills.map((skill) => <div className="skill-logo-item" key={skill.name} title={skill.name}><img src={skill.icon} alt="" /><span>{skill.name}</span></div>)}</div></section>)}</div></div></section>

    {modalWork && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeWork(); }}><section className="modal-window" role="dialog" aria-modal="true" aria-label={`${modalWork.title} Case Study`}>
      <button className="modal-close" type="button" onClick={closeWork}>×</button>
      <div className="modal-meta"><span>{modalWork.number} //</span><span className="work-pill">{modalWork.type}</span><span className="work-status">● {modalWork.status}</span><span>{modalWork.year}</span></div>
      <h2 className="modal-title">{modalWork.title}</h2><p className="modal-lead">{modalWork.subtitle}</p><img className="modal-main-image" src={modalWork.image} alt={`${modalWork.title} メインビジュアル`} />
      <div className="modal-actions">{modalWork.playUrl && <a className="modal-action primary" href={modalWork.playUrl} target="_blank" rel="noreferrer">▶ PLAY GAME</a>}{modalWork.videoUrl && <a className="modal-action" href={modalWork.videoUrl} target="_blank" rel="noreferrer">▶ GAMEPLAY VIDEO</a>}{modalWork.repoUrl && <a className="modal-action" href={modalWork.repoUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}{modalWork.url && <a className="modal-action" href={modalWork.url} target="_blank" rel="noreferrer">PROJECT ↗</a>}</div>

      <div className="modal-info-grid"><div><p className="eyebrow">PROJECT OVERVIEW</p><h3>作品概要</h3></div><div className="modal-copy"><p>{modalWork.description}</p><dl className="modal-facts"><div><dt>ROLE</dt><dd>{modalWork.role}</dd></div><div><dt>TEAM</dt><dd>{modalWork.team}</dd></div>{modalWork.contribution && <div><dt>CONTRIBUTION</dt><dd>{modalWork.contribution}</dd></div>}<div><dt>TOOLS</dt><dd><ul className="modal-tools">{modalWork.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></dd></div></dl></div></div>

      {modalWork.plannerPoint && <div className="planner-point"><p className="eyebrow">PLANNER POINT</p><p>{modalWork.plannerPoint}</p></div>}
      <section className="case-study"><div className="case-study-head"><div><p className="eyebrow">DESIGN PROCESS</p><h3>CASE STUDY</h3></div></div><div className="case-study-grid">
        {[{n:"01",t:"課題",v:modalWork.problem},{n:"02",t:"狙い",v:modalWork.intent},{n:"03",t:"判断・仕様",v:modalWork.decision},{n:"04",t:"結果・学び",v:modalWork.result}].filter((step) => step.v).map((step) => <article className="case-step" key={step.n}><span className="case-step-number">{step.n} / PROCESS</span><h4>{step.t}</h4><p>{step.v}</p></article>)}
      </div></section>

      {(modalWork.challenge || modalWork.highlights.length > 0) && <section className="modal-section"><p className="eyebrow">DETAIL</p><h3>工夫・ポイント</h3>{modalWork.challenge && <p className="modal-copy">{modalWork.challenge}</p>}{modalWork.highlights.length > 0 && <ul className="modal-highlights">{modalWork.highlights.map((item) => <li key={item}>↗ {item}</li>)}</ul>}</section>}

      {(modalWork.proposalPdf || modalWork.specPdf || modalWork.presentationPdf) && <section className="modal-section"><p className="eyebrow">DOCUMENTS</p><h3>企画・仕様資料</h3><div className="document-grid">{modalWork.proposalPdf && <button className="document-button" type="button" onClick={() => setPdfPreview({url:modalWork.proposalPdf,label:"企画書"})}><span>企画書</span><span>VIEW PDF ↗</span></button>}{modalWork.specPdf && <button className="document-button" type="button" onClick={() => setPdfPreview({url:modalWork.specPdf,label:"仕様書"})}><span>仕様書</span><span>VIEW PDF ↗</span></button>}{modalWork.presentationPdf && <button className="document-button" type="button" onClick={() => setPdfPreview({url:modalWork.presentationPdf,label:"プレゼン資料"})}><span>プレゼン資料</span><span>VIEW PDF ↗</span></button>}</div></section>}

      <section className="modal-section"><p className="eyebrow">SCREENS / PHOTOS</p><h3>GALLERY</h3><div className="modal-gallery">{modalWork.gallery.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${modalWork.title} ギャラリー ${index + 1}`} />)}</div></section>
    </section></div>}

    {pdfPreview && <div className="pdf-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setPdfPreview(null); }}><section className="pdf-window" role="dialog" aria-modal="true"><header className="pdf-header"><strong>{pdfPreview.label}</strong><div className="pdf-header-actions"><a href={pdfPreview.url} target="_blank" rel="noreferrer">別タブで開く ↗</a><button type="button" onClick={() => setPdfPreview(null)}>閉じる ×</button></div></header><iframe className="pdf-frame" src={pdfPreview.url} title={pdfPreview.label} /></section></div>}

    <AdminPanel />
  </main>;
}
