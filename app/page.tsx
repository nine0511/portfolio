"use client";

import { useEffect, useMemo, useState } from "react";
import contentData from "../data/content.json";
import AdminPanel from "./components/AdminPanel";

const demoImage = (title: string, subtitle: string, variant = 1) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
      <rect width="1200" height="700" fill="#f3f3f3"/>
      <rect x="42" y="42" width="1116" height="616" rx="24" fill="#fff" stroke="#111" stroke-width="5"/>
      ${variant === 1 ? `
        <rect x="90" y="100" width="300" height="500" rx="28" fill="#ededed" stroke="#bdbdbd" stroke-width="3"/>
        <rect x="450" y="100" width="300" height="500" rx="28" fill="#f8f8f8" stroke="#bdbdbd" stroke-width="3"/>
        <rect x="810" y="100" width="300" height="500" rx="28" fill="#ededed" stroke="#bdbdbd" stroke-width="3"/>
      ` : variant === 2 ? `
        <rect x="95" y="95" width="1010" height="105" rx="20" fill="#111"/>
        <rect x="95" y="245" width="310" height="345" rx="22" fill="#e1e1e1"/>
        <rect x="445" y="245" width="310" height="345" rx="22" fill="#f0f0f0"/>
        <rect x="795" y="245" width="310" height="345" rx="22" fill="#e1e1e1"/>
      ` : `
        <rect x="95" y="100" width="1010" height="365" rx="24" fill="#e9e9e9" stroke="#bdbdbd" stroke-width="3"/>
        <rect x="95" y="505" width="300" height="95" rx="18" fill="#111"/>
        <rect x="450" y="505" width="300" height="95" rx="18" fill="#d6d6d6"/>
        <rect x="805" y="505" width="300" height="95" rx="18" fill="#ededed"/>
      `}
      <text x="600" y="345" text-anchor="middle" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#111">${title}</text>
      <text x="600" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#666">${subtitle}</text>
      <text x="600" y="640" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#888">DEMO PROJECT VISUAL</text>
    </svg>
  `)}`;

const galleryImage = (title: string, label: string, variant: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760">
      <rect width="1200" height="760" fill="#f4f4f4"/>
      <rect x="46" y="46" width="1108" height="668" rx="28" fill="#fff" stroke="#111" stroke-width="5"/>
      ${variant === 1 ? `
        <rect x="105" y="125" width="440" height="510" rx="24" fill="#ededed" stroke="#bdbdbd" stroke-width="3"/>
        <rect x="600" y="125" width="490" height="190" rx="22" fill="#111"/>
        <rect x="600" y="350" width="230" height="285" rx="22" fill="#dedede"/>
        <rect x="860" y="350" width="230" height="285" rx="22" fill="#ededed"/>
      ` : variant === 2 ? `
        <rect x="100" y="120" width="1000" height="120" rx="22" fill="#111"/>
        <rect x="100" y="285" width="310" height="350" rx="22" fill="#e2e2e2"/>
        <rect x="445" y="285" width="310" height="350" rx="22" fill="#efefef"/>
        <rect x="790" y="285" width="310" height="350" rx="22" fill="#e2e2e2"/>
      ` : `
        <rect x="105" y="120" width="990" height="390" rx="24" fill="#e9e9e9" stroke="#bdbdbd" stroke-width="3"/>
        <rect x="105" y="550" width="300" height="85" rx="18" fill="#111"/>
        <rect x="450" y="550" width="300" height="85" rx="18" fill="#d8d8d8"/>
        <rect x="795" y="550" width="300" height="85" rx="18" fill="#ededed"/>
      `}
      <text x="600" y="82" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="800" fill="#111">${title}</text>
      <text x="600" y="690" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#777">${label}</text>
    </svg>
  `)}`;

type Work = (typeof contentData.works)[number] & { image: string; gallery: string[] };
type Product = (typeof contentData.products)[number] & { image: string };

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
  const works = useMemo<Work[]>(
    () => contentData.works.map((work, index) => ({
      ...work,
      image: work.image || demoImage(work.title.toUpperCase(), work.type, (index % 3) + 1),
      gallery: work.gallery.length > 0 ? work.gallery : [
        galleryImage(work.title, "SCREEN / PHOTO 01", 1),
        galleryImage(work.title, "SCREEN / PHOTO 02", 2),
        galleryImage(work.title, "SCREEN / PHOTO 03", 3),
      ],
    })),
    [],
  );

  const products = useMemo<Product[]>(
    () => contentData.products.map((product, index) => ({
      ...product,
      image: product.image || demoImage(product.title.toUpperCase(), product.type, (index % 3) + 1),
    })),
    [],
  );

  const articles = contentData.articles;
  const [activeWork, setActiveWork] = useState(0);
  const [selectedWork, setSelectedWork] = useState<number | null>(null);

  const previousWork = () => setActiveWork((current) => (current - 1 + works.length) % works.length);
  const nextWork = () => setActiveWork((current) => (current + 1) % works.length);
  const closeModal = () => setSelectedWork(null);
  const modalWork = selectedWork === null ? null : works[selectedWork];

  useEffect(() => {
    if (selectedWork === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedWork]);

  return (
    <main>
      <style>{`
        .site-header nav { overflow-x: auto; white-space: nowrap; scrollbar-width: none; }
        .site-header nav::-webkit-scrollbar { display: none; }
        .site-header nav a { display: inline-flex !important; }

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
        .view-more { appearance: none; border: 0; padding: 0; background: transparent; color: inherit; white-space: nowrap; font: inherit; font-size: 15px; font-weight: 900; letter-spacing: .04em; cursor: pointer; }
        .work-external { display: inline-flex; margin-top: 14px; padding: 9px 13px; border: 1.5px solid #0a0a0a; border-radius: 999px; font-size: 11px; font-weight: 800; }
        .carousel-arrow { position: absolute; z-index: 5; top: 50%; width: 58px; height: 58px; display: grid; place-items: center; border: 3px solid #0a0a0a; border-radius: 50%; background: #fff; color: #0a0a0a; font-size: 28px; cursor: pointer; transform: translateY(-50%); }
        .carousel-arrow.left { left: max(0px, calc(50% - 570px)); }
        .carousel-arrow.right { right: max(0px, calc(50% - 570px)); }
        .carousel-dots { display: flex; justify-content: center; gap: 10px; }
        .carousel-dot { width: 10px; height: 10px; padding: 0; border: 2px solid #0a0a0a; border-radius: 999px; background: #fff; cursor: pointer; }
        .carousel-dot.active { width: 34px; background: #0a0a0a; }

        .products-section { padding: 128px 0; background: #f7f7f7; border-top: 1px solid #dedede; border-bottom: 1px solid #dedede; }
        .products-heading, .articles-heading { display: flex; align-items: end; justify-content: space-between; gap: 32px; margin-bottom: 52px; }
        .products-heading h2, .articles-heading h2 { margin: 0; font-size: clamp(58px, 8vw, 108px); line-height: .9; letter-spacing: -.07em; }
        .section-description { max-width: 430px; margin: 0 0 4px; color: #666; font-size: 14px; line-height: 1.8; }
        .products-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
        .product-card { overflow: hidden; display: flex; flex-direction: column; background: #fff; border: 1px solid #d6d6d6; border-radius: 22px; box-shadow: 0 12px 28px rgba(0,0,0,.06); }
        .product-image-wrap { position: relative; overflow: hidden; aspect-ratio: 16 / 9; border-bottom: 1px solid #dedede; background: #eee; }
        .product-image-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .product-tech { position: absolute; top: 14px; right: 14px; padding: 7px 10px; border: 1px solid #bbb; border-radius: 999px; background: rgba(255,255,255,.92); font-size: 10px; font-weight: 800; letter-spacing: .07em; }
        .product-body { display: flex; flex: 1; flex-direction: column; padding: 26px 28px 22px; }
        .product-body h3 { margin: 0; font-size: clamp(24px, 2.5vw, 34px); line-height: 1.2; letter-spacing: -.04em; }
        .product-body > p { margin: 14px 0 22px; color: #4b4b4b; font-size: 14px; line-height: 1.8; }
        .product-bottom { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-top: auto; padding-top: 16px; border-top: 1px solid #ececec; }
        .product-meta { color: #777; font-size: 11px; line-height: 1.6; }
        .product-button { padding: 9px 13px; border: 1.5px solid #0a0a0a; border-radius: 999px; background: #fff; color: #0a0a0a; font-size: 11px; font-weight: 800; cursor: pointer; }
        .product-button:hover { background: #0a0a0a; color: #fff; }

        .articles-section { padding: 128px 0; background: #fff; }
        .article-list { border-top: 1px solid #bdbdbd; }
        .article-card { display: grid; grid-template-columns: 72px 150px 1fr 32px; gap: 24px; align-items: start; padding: 30px 0; border-bottom: 1px solid #dedede; transition: padding .2s ease, background .2s ease; }
        .article-card:hover { padding-left: 16px; padding-right: 16px; background: #f7f7f7; }
        .article-number { color: #777; font-family: monospace; font-size: 13px; font-weight: 800; }
        .article-meta { color: #777; font-size: 10px; font-weight: 800; line-height: 1.6; letter-spacing: .08em; }
        .article-main h3 { margin: 0; font-size: clamp(24px, 3vw, 38px); letter-spacing: -.04em; }
        .article-main p { max-width: 720px; margin: 10px 0 0; color: #4b4b4b; font-size: 14px; line-height: 1.8; }
        .article-arrow { font-size: 24px; text-align: right; }
        .article-card-link { display: contents; }

        .modal-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 32px; background: rgba(0,0,0,.72); backdrop-filter: blur(5px); }
        .modal-window { position: relative; width: min(1040px, 100%); max-height: calc(100vh - 64px); overflow-y: auto; padding: 40px; background: #fff; border: 3px solid #0a0a0a; border-radius: 26px; box-shadow: 18px 18px 0 #0a0a0a; }
        .modal-close { position: sticky; top: 0; z-index: 3; float: right; width: 48px; height: 48px; border: 2px solid #0a0a0a; border-radius: 50%; background: #fff; font-size: 26px; cursor: pointer; }
        .modal-meta { display: flex; flex-wrap: wrap; gap: 9px; padding-right: 64px; font-size: 11px; font-weight: 800; }
        .modal-title { margin: 14px 70px 8px 0; font-size: clamp(42px, 7vw, 82px); line-height: .95; letter-spacing: -.065em; }
        .modal-lead { max-width: 760px; margin: 0 0 24px; color: #555; font-size: 16px; line-height: 1.8; }
        .modal-main-image { width: 100%; display: block; border: 2px solid #0a0a0a; border-radius: 16px; }
        .modal-info-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 52px; padding: 50px 0; }
        .modal-info-grid h3 { margin: 0; font-size: clamp(32px, 4vw, 52px); letter-spacing: -.05em; }
        .modal-copy { color: #333; font-size: 14px; line-height: 1.9; }
        .modal-facts { margin-top: 30px; border-top: 1px solid #ccc; }
        .modal-facts div { display: grid; grid-template-columns: 105px 1fr; gap: 18px; padding: 14px 0; border-bottom: 1px solid #ddd; }
        .modal-facts dt { color: #777; font-size: 10px; font-weight: 800; }
        .modal-facts dd { margin: 0; font-size: 13px; font-weight: 700; }
        .modal-tools { display: flex; flex-wrap: wrap; gap: 6px; padding: 0; margin: 0; list-style: none; }
        .modal-tools li { padding: 4px 8px; border: 1px solid #aaa; border-radius: 999px; font-size: 10px; }
        .modal-highlights { margin: 22px 0 0; padding: 0; list-style: none; border-top: 1px solid #ccc; }
        .modal-highlights li { padding: 13px 0; border-bottom: 1px solid #ddd; font-size: 13px; font-weight: 700; }
        .modal-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .modal-gallery img { width: 100%; display: block; border: 2px solid #0a0a0a; border-radius: 14px; }
        .modal-gallery img:first-child { grid-column: 1 / -1; }

        @media (max-width: 900px) {
          .site-header { align-items: flex-start; flex-direction: column; gap: 12px; }
          .site-header nav { width: 100%; gap: 16px; }
          .work-carousel-stage { min-height: 650px; }
          .work-slide { width: min(760px, 82vw); min-height: 570px; padding: 24px; }
          .products-heading, .articles-heading { align-items: flex-start; flex-direction: column; }
          .article-card { grid-template-columns: 54px 120px 1fr 28px; gap: 16px; }
        }
        @media (max-width: 700px) {
          .work-carousel-stage { min-height: 620px; }
          .work-slide { width: calc(100% - 18px); min-height: 550px; border-width: 3px; border-radius: 22px; box-shadow: 10px 10px 0 #0a0a0a; padding: 20px; }
          .work-slide.prev, .work-slide.next { opacity: 0; transform: scale(.92); }
          .carousel-arrow { top: auto; bottom: -3px; width: 46px; height: 46px; font-size: 22px; transform: none; }
          .carousel-arrow.left { left: 18px; }
          .carousel-arrow.right { right: 18px; }
          .products-section, .articles-section { padding: 88px 0; }
          .products-grid { grid-template-columns: 1fr; gap: 22px; }
          .article-card { grid-template-columns: 40px 1fr 26px; }
          .article-meta, .article-main { grid-column: 2; }
          .article-arrow { grid-column: 3; grid-row: 1 / span 2; }
          .modal-backdrop { padding: 14px; }
          .modal-window { max-height: calc(100vh - 28px); padding: 24px 20px; border-radius: 18px; box-shadow: 8px 8px 0 #0a0a0a; }
          .modal-info-grid { grid-template-columns: 1fr; gap: 24px; padding: 36px 0; }
          .modal-gallery { grid-template-columns: 1fr; }
          .modal-gallery img:first-child { grid-column: auto; }
        }
      `}</style>

      <header className="site-header">
        <a className="logo" href="#top" aria-label="トップへ">NINE0511</a>
        <nav aria-label="メインナビゲーション">
          <a href="#works">WORK</a>
          <a href="#profile">PROFILE</a>
          <a href="#products">PRODUCTS</a>
          <a href="#article">ARTICLE</a>
          <a href="#skills">SKILL</a>
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
        {works.length > 0 && (
          <div className="work-carousel-wrap">
            <div className="work-carousel-stage">
              {works.map((work, index) => {
                const previous = (activeWork - 1 + works.length) % works.length;
                const next = (activeWork + 1) % works.length;
                const state = index === activeWork ? "active" : index === previous ? "prev" : index === next ? "next" : "hidden";
                return (
                  <article className={`work-slide ${state}`} key={work.id} aria-hidden={index !== activeWork}>
                    <div className="work-slide-top">
                      <div className="work-meta"><span className="work-index">{work.number} //</span><span className="work-pill">{work.type}</span><span className="work-status">● {work.status}</span></div>
                      <span className="work-year">{work.year}</span>
                    </div>
                    <h3>{work.title}</h3>
                    <p className="work-slide-subtitle">{work.subtitle}</p>
                    <img className="work-thumb" src={work.image} alt={`${work.title} のサムネイル`} />
                    <p className="work-slide-description">{work.description}</p>
                    <div className="work-slide-footer">
                      <p className="work-hashtags">{work.tags.map((tag) => `#${tag.replaceAll(" ", "")}`).join("  ")}</p>
                      <button className="view-more" type="button" onClick={() => setSelectedWork(index)}>VIEW MORE →</button>
                    </div>
                  </article>
                );
              })}
              {works.length > 1 && <><button className="carousel-arrow left" type="button" onClick={previousWork} aria-label="前の作品">←</button><button className="carousel-arrow right" type="button" onClick={nextWork} aria-label="次の作品">→</button></>}
            </div>
            <div className="carousel-dots">{works.map((work, index) => <button key={work.id} type="button" className={`carousel-dot ${index === activeWork ? "active" : ""}`} onClick={() => setActiveWork(index)} aria-label={`${work.title}を表示`} />)}</div>
          </div>
        )}
      </section>

      <section id="profile" className="section-shell section-block profile-grid">
        <div className="section-heading sticky-heading"><p className="eyebrow">ABOUT ME</p><h2>PROFILE</h2></div>
        <div className="profile-copy">
          <p className="lead">情報科学を学びながら、ゲーム制作・Web開発・チーム開発に取り組んでいます。</p>
          <p>企画だけ、実装だけに閉じず、ユーザーがどう感じるかまで考えて形にすることを大切にしています。特にゲームではレベルデザインやUI、システム設計に関心があります。</p>
          <dl className="profile-facts"><div><dt>FIELD</dt><dd>Game Design / Web / UI・UX</dd></div><div><dt>BASED IN</dt><dd>Hiroshima, Japan</dd></div><div><dt>FOCUS</dt><dd>Planning × Implementation</dd></div></dl>
        </div>
      </section>

      <section id="products" className="products-section">
        <div className="section-shell">
          <div className="products-heading"><div><p className="eyebrow">ALL PROJECTS</p><h2>PRODUCTS</h2></div><p className="section-description">これまでの制作物を一覧で見られるセクションです。</p></div>
          <div className="products-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap"><img src={product.image} alt={`${product.title} のサムネイル`} /><span className="product-tech">{product.type}</span></div>
                <div className="product-body">
                  <h3>{product.title}</h3><p>{product.description}</p>
                  <div className="product-bottom"><div className="product-meta">制作：{product.year}<br />{product.meta}</div>{product.url ? <a className="product-button" href={product.url} target="_blank" rel="noreferrer">OPEN →</a> : <span className="product-meta">URL未設定</span>}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="article" className="articles-section">
        <div className="section-shell">
          <div className="articles-heading"><div><p className="eyebrow">WRITING / NOTES</p><h2>ARTICLE</h2></div><p className="section-description">制作過程やゲームデザイン、技術についての記事を紹介します。</p></div>
          <div className="article-list">
            {articles.map((article) => {
              const inner = <><div className="article-number">{article.number}</div><div className="article-meta">{article.date}<br />{article.category}</div><div className="article-main"><h3>{article.title}</h3><p>{article.description}</p></div><div className="article-arrow">↗</div></>;
              return article.url ? <a className="article-card" key={article.id} href={article.url} target="_blank" rel="noreferrer">{inner}</a> : <article className="article-card" key={article.id}>{inner}</article>;
            })}
          </div>
        </div>
      </section>

      <section id="skills" className="skills-showcase">
        <div className="section-shell skills-inner"><h2 className="skills-title">スキルセット</h2><div className="skill-groups">{skillGroups.map((group) => <section className="skill-group" key={group.title}><h3>{group.title}</h3><div className="skill-logo-row">{group.skills.map((skill) => <div className="skill-logo-item" key={skill.name} title={skill.name}><img src={skill.icon} alt="" /><span>{skill.name}</span></div>)}</div></section>)}</div></div>
      </section>

      <section id="contact" className="contact-section"><div className="section-shell contact-inner"><p className="eyebrow">GET IN TOUCH</p><h2>LET&apos;S MAKE<br />SOMETHING GOOD.</h2><div className="contact-links"><a href="https://github.com/nine0511" target="_blank" rel="noreferrer">GitHub ↗</a></div><footer><span>© 2026 nine0511</span><a href="#top">BACK TO TOP ↑</a></footer></div></section>

      {modalWork && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="modal-window" role="dialog" aria-modal="true" aria-label={`${modalWork.title} の詳細`}>
            <button className="modal-close" type="button" onClick={closeModal}>×</button>
            <div className="modal-meta"><span>{modalWork.number} //</span><span className="work-pill">{modalWork.type}</span><span className="work-status">● {modalWork.status}</span><span>{modalWork.year}</span></div>
            <h2 className="modal-title">{modalWork.title}</h2><p className="modal-lead">{modalWork.subtitle}</p>
            <img className="modal-main-image" src={modalWork.image} alt={`${modalWork.title} メインビジュアル`} />
            {modalWork.url && <a className="work-external" href={modalWork.url} target="_blank" rel="noreferrer">OPEN PROJECT ↗</a>}
            <div className="modal-info-grid">
              <div><p className="eyebrow">PROJECT DETAIL</p><h3>作品詳細</h3></div>
              <div className="modal-copy"><p>{modalWork.description}</p><dl className="modal-facts"><div><dt>ROLE</dt><dd>{modalWork.role}</dd></div><div><dt>TEAM</dt><dd>{modalWork.team}</dd></div><div><dt>TOOLS</dt><dd><ul className="modal-tools">{modalWork.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></dd></div></dl><p style={{marginTop: 30}}>{modalWork.challenge}</p><ul className="modal-highlights">{modalWork.highlights.map((item) => <li key={item}>↗ {item}</li>)}</ul></div>
            </div>
            <div className="modal-gallery">{modalWork.gallery.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${modalWork.title} ギャラリー ${index + 1}`} />)}</div>
          </section>
        </div>
      )}

      <AdminPanel />
    </main>
  );
}
