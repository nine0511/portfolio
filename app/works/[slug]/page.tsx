import { notFound } from "next/navigation";

const demoDetailImage = (title: string, label: string, variant: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 900">
      <rect width="1400" height="900" fill="${variant % 2 === 0 ? "#f1f1f1" : "#e8e8e8"}"/>
      <rect x="55" y="55" width="1290" height="790" rx="30" fill="#fff" stroke="#111" stroke-width="5"/>
      <text x="105" y="145" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#111">${label}</text>
      <text x="105" y="215" font-family="Arial, sans-serif" font-size="64" font-weight="900" fill="#111">${title}</text>
      ${variant === 0 ? `
        <rect x="105" y="285" width="360" height="470" rx="24" fill="#ededed" stroke="#aaa" stroke-width="3"/>
        <rect x="520" y="285" width="360" height="470" rx="24" fill="#f6f6f6" stroke="#aaa" stroke-width="3"/>
        <rect x="935" y="285" width="360" height="470" rx="24" fill="#ededed" stroke="#aaa" stroke-width="3"/>
        <rect x="150" y="350" width="270" height="65" rx="10" fill="#111"/>
        <rect x="565" y="350" width="270" height="65" rx="10" fill="#111"/>
        <rect x="980" y="350" width="270" height="65" rx="10" fill="#111"/>
        <rect x="150" y="455" width="270" height="210" rx="15" fill="#d4d4d4"/>
        <rect x="565" y="455" width="270" height="210" rx="15" fill="#dedede"/>
        <rect x="980" y="455" width="270" height="210" rx="15" fill="#d4d4d4"/>
      ` : variant === 1 ? `
        <rect x="105" y="285" width="1190" height="110" rx="16" fill="#111"/>
        <rect x="105" y="440" width="550" height="315" rx="22" fill="#ececec" stroke="#aaa" stroke-width="3"/>
        <rect x="700" y="440" width="595" height="145" rx="22" fill="#f4f4f4" stroke="#aaa" stroke-width="3"/>
        <rect x="700" y="610" width="595" height="145" rx="22" fill="#e4e4e4" stroke="#aaa" stroke-width="3"/>
      ` : `
        <circle cx="360" cy="520" r="210" fill="#e2e2e2" stroke="#999" stroke-width="3"/>
        <circle cx="360" cy="520" r="135" fill="#fff" stroke="#111" stroke-width="4"/>
        <rect x="650" y="300" width="645" height="95" rx="16" fill="#111"/>
        <rect x="650" y="435" width="645" height="115" rx="16" fill="#ededed" stroke="#aaa" stroke-width="3"/>
        <rect x="650" y="585" width="305" height="170" rx="16" fill="#e0e0e0"/>
        <rect x="990" y="585" width="305" height="170" rx="16" fill="#f0f0f0"/>
      `}
      <text x="1295" y="810" text-anchor="end" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#888">DEMO SCREENSHOT</text>
    </svg>
  `)}`;

const works = {
  "smart-delivery": {
    number: "01",
    title: "スマート配達",
    type: "WEB / AI",
    status: "AWARD",
    year: "2026",
    lead: "再配達を減らすことを目的に、配達員と受取人の双方が柔軟に予定を調整できる配送支援システム。",
    overview:
      "3人チームで制作した地域課題解決型のプロダクトです。東広島市へのヒアリングを通じて現場の課題を整理し、ドライバー目線で使いやすい配送体験を設計しました。",
    role: "実装 / 東広島市へのヒアリング / LP制作",
    team: "3人チーム",
    tools: ["AWS", "Web", "UI/UX", "GitHub"],
    challenge:
      "短期間でプレゼン品質まで高めるため、実装速度を上げる開発体制づくりを重視しました。コア機能を早い段階で完成させ、検証や発表資料に十分な時間を確保しました。",
    highlights: [
      "地域創生というテーマに対して、実際の自治体ヒアリングを企画へ反映",
      "チームの開発速度を高めるため、AI開発支援ツールの導入を主導",
      "機能説明だけではなく、利用シーンが直感的に伝わるLPを制作",
    ],
  },
  flipilf: {
    number: "02",
    title: "FlipilF",
    type: "GAME",
    status: "UNITY",
    year: "2025",
    lead: "『何でも入れ替える』というひとつのルールから、攻略方法を考える楽しさを生み出したUnityゲーム。",
    overview:
      "オブジェクト同士を入れ替える仕組みを中心に、プレイヤーがステージの状況を読み替えながら進むゲームとして制作しました。ルールの分かりやすさと応用の幅を両立することを意識しています。",
    role: "ゲーム企画 / レベル設計 / 一部実装",
    team: "ゲーム制作",
    tools: ["Unity", "C#", "Game Design", "Level Design"],
    challenge:
      "単純な入れ替え操作だけで単調にならないよう、ステージ内の配置やギミックの組み合わせによって、同じルールから異なる判断を要求する設計を行いました。",
    highlights: [
      "操作ルールを少なくし、初見でも理解しやすいゲーム性を重視",
      "入れ替え対象の配置によって複数の攻略方法が生まれるよう設計",
      "企画と実装を往復しながら、遊んだ時のテンポを調整",
    ],
  },
  "heroic-cards": {
    number: "03",
    title: "中華統一 ～英雄札譚～",
    type: "PLANNING",
    status: "GAME",
    year: "2026",
    lead: "デッキ構築ローグライクと中国史を組み合わせ、英雄と戦術の選択で戦況が変化するゲーム企画。",
    overview:
      "中国史の人物や戦術をカードとして扱い、プレイヤーが自分の戦略を組み立てながら統一を目指す企画です。毎回異なる選択が生まれるローグライク性と、歴史人物の個性が戦術へ直結する設計を目指しました。",
    role: "ゲーム企画 / システム設計 / レベルデザイン / シナリオ設計",
    team: "個人企画",
    tools: ["Planning", "Level Design", "Scenario", "Game System"],
    challenge:
      "歴史題材の情報量がゲームプレイを邪魔しないよう、人物の特徴をカード効果や戦況変化へ変換し、説明を読まなくても個性を感じられる設計を重視しました。",
    highlights: [
      "リスクとリターンを伴う選択を継続的に提示",
      "歴史人物の特徴をゲームシステムへ落とし込む設計",
      "周回ごとに異なる展開が生まれるデッキ構築要素",
    ],
  },
} as const;

export function generateStaticParams() {
  return Object.keys(works).map((slug) => ({ slug }));
}

type WorkSlug = keyof typeof works;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const work = works[slug as WorkSlug];

  if (!work) notFound();

  const gallery = [
    demoDetailImage(work.title, "01 / MAIN SCREEN", 0),
    demoDetailImage(work.title, "02 / FEATURE", 1),
    demoDetailImage(work.title, "03 / DETAIL", 2),
  ];

  return (
    <main className="detail-page">
      <style>{`
        .detail-page { min-height: 100vh; background: #fff; color: #0a0a0a; }
        .detail-shell { width: min(calc(100% - 48px), 1180px); margin: 0 auto; }
        .detail-nav { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px 0; border-bottom: 1px solid #dedede; font-size: 12px; font-weight: 800; letter-spacing: .08em; }
        .detail-nav a:hover { opacity: .5; }
        .detail-hero { padding: 70px 0 56px; }
        .detail-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; font-size: 12px; font-weight: 900; letter-spacing: .06em; }
        .detail-index { font-family: monospace; }
        .detail-pill { padding: 7px 10px; border: 2px solid #0a0a0a; background: #0a0a0a; color: #fff; border-radius: 4px; }
        .detail-status { padding: 6px 10px; border: 2px solid #0a0a0a; border-radius: 4px; }
        .detail-year { margin-left: auto; color: #888; font-family: monospace; font-size: 16px; }
        .detail-hero h1 { margin: 0; max-width: 1050px; font-size: clamp(54px, 9vw, 128px); line-height: .92; letter-spacing: -.075em; }
        .detail-lead { max-width: 820px; margin: 30px 0 0; font-size: clamp(20px, 2.4vw, 32px); line-height: 1.55; font-weight: 700; letter-spacing: -.025em; }
        .detail-main-image { width: 100%; display: block; border: 4px solid #0a0a0a; border-radius: 28px; box-shadow: 18px 18px 0 #0a0a0a; }
        .detail-info { display: grid; grid-template-columns: .9fr 1.1fr; gap: 80px; padding: 120px 0; }
        .detail-label { margin: 0 0 18px; color: #777; font-size: 11px; font-weight: 900; letter-spacing: .12em; }
        .detail-info h2 { margin: 0; font-size: clamp(42px, 6vw, 76px); line-height: .95; letter-spacing: -.06em; }
        .detail-copy { padding-top: 6px; }
        .detail-copy > p { margin: 0; color: #333; font-size: 17px; line-height: 2; }
        .detail-facts { margin: 46px 0 0; border-top: 1px solid #d8d8d8; }
        .detail-facts div { display: grid; grid-template-columns: 130px 1fr; gap: 20px; padding: 18px 0; border-bottom: 1px solid #d8d8d8; }
        .detail-facts dt { color: #777; font-size: 11px; font-weight: 900; letter-spacing: .08em; }
        .detail-facts dd { margin: 0; font-weight: 700; }
        .tool-list { display: flex; flex-wrap: wrap; gap: 7px; padding: 0; margin: 0; list-style: none; }
        .tool-list li { padding: 5px 8px; border: 1px solid #aaa; border-radius: 999px; font-size: 11px; }
        .detail-challenge { padding: 100px 0; border-top: 1px solid #d8d8d8; }
        .detail-challenge-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 80px; }
        .detail-challenge h2 { margin: 0; font-size: clamp(40px, 5vw, 70px); letter-spacing: -.055em; line-height: 1; }
        .challenge-copy > p { margin: 0 0 36px; color: #333; font-size: 18px; line-height: 1.9; }
        .challenge-copy ul { margin: 0; padding: 0; list-style: none; border-top: 1px solid #d8d8d8; }
        .challenge-copy li { padding: 18px 0; border-bottom: 1px solid #d8d8d8; font-weight: 700; line-height: 1.6; }
        .challenge-copy li::before { content: "↗"; margin-right: 12px; }
        .gallery-section { padding: 110px 0 130px; background: #f3f3f3; }
        .gallery-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 42px; }
        .gallery-heading h2 { margin: 0; font-size: clamp(48px, 7vw, 94px); letter-spacing: -.065em; line-height: .95; }
        .gallery-heading p { margin: 0 0 7px; color: #777; font-size: 12px; font-weight: 800; letter-spacing: .08em; }
        .gallery-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
        .gallery-item { margin: 0; }
        .gallery-item:first-child { grid-column: 1 / -1; }
        .gallery-item img { width: 100%; display: block; border: 3px solid #0a0a0a; border-radius: 20px; background: #fff; }
        .gallery-item figcaption { margin-top: 10px; color: #666; font-family: monospace; font-size: 11px; font-weight: 700; }
        .detail-footer { padding: 34px 0; background: #0a0a0a; color: #fff; }
        .detail-footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; font-size: 12px; font-weight: 800; letter-spacing: .07em; }
        .detail-footer a:hover { opacity: .6; }
        @media (max-width: 760px) {
          .detail-shell { width: min(calc(100% - 28px), 1180px); }
          .detail-hero { padding-top: 48px; }
          .detail-year { width: 100%; margin-left: 0; }
          .detail-main-image { border-width: 3px; border-radius: 18px; box-shadow: 9px 9px 0 #0a0a0a; }
          .detail-info, .detail-challenge-grid { grid-template-columns: 1fr; gap: 34px; }
          .detail-info { padding: 84px 0; }
          .detail-challenge { padding: 76px 0; }
          .gallery-section { padding: 80px 0 90px; }
          .gallery-heading { align-items: flex-start; flex-direction: column; }
          .gallery-grid { grid-template-columns: 1fr; }
          .gallery-item:first-child { grid-column: auto; }
          .detail-facts div { grid-template-columns: 90px 1fr; }
        }
      `}</style>

      <div className="detail-shell">
        <nav className="detail-nav">
          <a href="/">← PORTFOLIO</a>
          <span>WORK DETAIL</span>
        </nav>

        <section className="detail-hero">
          <div className="detail-meta">
            <span className="detail-index">{work.number} //</span>
            <span className="detail-pill">{work.type}</span>
            <span className="detail-status">● {work.status}</span>
            <span className="detail-year">{work.year}</span>
          </div>
          <h1>{work.title}</h1>
          <p className="detail-lead">{work.lead}</p>
        </section>

        <img className="detail-main-image" src={gallery[0]} alt={`${work.title} メインビジュアル`} />

        <section className="detail-info">
          <div>
            <p className="detail-label">ABOUT THIS PROJECT</p>
            <h2>PROJECT<br />OVERVIEW</h2>
          </div>
          <div className="detail-copy">
            <p>{work.overview}</p>
            <dl className="detail-facts">
              <div><dt>ROLE</dt><dd>{work.role}</dd></div>
              <div><dt>TEAM</dt><dd>{work.team}</dd></div>
              <div><dt>TOOLS</dt><dd><ul className="tool-list">{work.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></dd></div>
            </dl>
          </div>
        </section>

        <section className="detail-challenge">
          <div className="detail-challenge-grid">
            <div>
              <p className="detail-label">DESIGN PROCESS</p>
              <h2>工夫したこと</h2>
            </div>
            <div className="challenge-copy">
              <p>{work.challenge}</p>
              <ul>{work.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </section>
      </div>

      <section className="gallery-section">
        <div className="detail-shell">
          <div className="gallery-heading">
            <h2>GALLERY</h2>
            <p>SCREENSHOTS / PHOTOS</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <figure className="gallery-item" key={image}>
                <img src={image} alt={`${work.title} 画面イメージ ${index + 1}`} />
                <figcaption>0{index + 1} / DEMO IMAGE — 実際のスクリーンショットに差し替え予定</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <footer className="detail-footer">
        <div className="detail-shell detail-footer-inner">
          <span>© 2026 NINE0511</span>
          <a href="/">PORTFOLIOへ戻る →</a>
        </div>
      </footer>
    </main>
  );
}
