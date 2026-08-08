"use client";

import { useState } from "react";

type SectionKey = "works" | "products" | "articles";
type SiteContent = { works: any[]; products: any[]; articles: any[] };

const emptyContent: SiteContent = { works: [], products: [], articles: [] };
const imageTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const maxImageSize = 4 * 1024 * 1024;
const maxPdfSize = 12 * 1024 * 1024;

const sectionLabels: Record<SectionKey, string> = {
  works: "WORK",
  products: "PRODUCTS",
  articles: "ARTICLE",
};

function newItem(section: SectionKey) {
  const baseId = `${section.slice(0, -1)}-${Date.now()}`;
  if (section === "works") {
    return {
      id: baseId,
      number: "01",
      title: "新しいWORK",
      type: "GAME",
      status: "NEW",
      year: String(new Date().getFullYear()),
      subtitle: "作品の短い説明",
      description: "作品の詳細説明を入力してください。",
      tags: [], image: "", url: "", role: "", team: "", tools: [], challenge: "", highlights: [], gallery: [],
      plannerPoint: "", problem: "", intent: "", decision: "", result: "", contribution: "",
      proposalPdf: "", specPdf: "", presentationPdf: "", playUrl: "", videoUrl: "", repoUrl: "",
    };
  }
  if (section === "products") {
    return {
      id: baseId, title: "新しいPRODUCT", type: "GAME", year: String(new Date().getFullYear()),
      description: "プロダクトの説明を入力してください。", image: "", url: "", meta: "",
    };
  }
  return {
    id: baseId, number: "01", date: `${new Date().getFullYear()}.08`, category: "GAME DESIGN",
    title: "新しい記事", description: "記事の概要を入力してください。", url: "", image: "",
    readTime: "5 MIN READ", tags: [],
  };
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    works: content.works.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") })),
    articles: content.articles.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") })),
  };
}

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [activeSection, setActiveSection] = useState<SectionKey>("works");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [canSave, setCanSave] = useState(false);

  const login = async () => {
    setBusy(true); setMessage("");
    try {
      const auth = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const authBody = await auth.json();
      if (!auth.ok) throw new Error(authBody.error || "認証に失敗しました。");
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "コンテンツを取得できませんでした。");
      setContent(normalizeContent(body.content));
      setCanSave(Boolean(body.canSave));
      setAuthenticated(true); setPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "エラーが発生しました。");
    } finally { setBusy(false); }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false); setContent(emptyContent); setOpen(false); setMessage("");
  };

  const updateItem = (section: SectionKey, index: number, key: string, value: any) => {
    setContent((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const addItem = () => {
    setContent((current) => normalizeContent({ ...current, [activeSection]: [newItem(activeSection), ...current[activeSection]] } as SiteContent));
    setMessage("新しい項目を先頭に追加しました。");
    window.setTimeout(() => {
      const firstItem = document.querySelector<HTMLElement>(".admin-items .admin-item:first-child");
      firstItem?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        const input = firstItem?.querySelector<HTMLInputElement>("[data-primary-input='true']");
        input?.focus(); input?.select();
      }, 250);
    }, 0);
  };

  const deleteItem = (index: number) => {
    if (!window.confirm("この項目を削除しますか？")) return;
    setContent((current) => normalizeContent({ ...current, [activeSection]: current[activeSection].filter((_, i) => i !== index) } as SiteContent));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    setContent((current) => {
      const list = [...current[activeSection]];
      const target = index + direction;
      if (target < 0 || target >= list.length) return current;
      [list[index], list[target]] = [list[target], list[index]];
      return normalizeContent({ ...current, [activeSection]: list } as SiteContent);
    });
  };

  const save = async () => {
    const normalized = normalizeContent(content);
    setContent(normalized); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: normalized }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "保存に失敗しました。");
      setMessage(body.message || "保存しました。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存に失敗しました。");
    } finally { setBusy(false); }
  };

  const uploadFiles = async (section: SectionKey, index: number, key: string, filesInput: FileList | File[], options: { multiple?: boolean; pdf?: boolean } = {}) => {
    const files = Array.from(filesInput);
    if (!files.length) return;
    const { multiple = false, pdf = false } = options;
    const invalid = files.find((file) => pdf ? file.type !== "application/pdf" : !imageTypes.includes(file.type));
    if (invalid) { setMessage(pdf ? "PDFファイルのみアップロードできます。" : `${invalid.name}: PNG / JPEG / WebP / GIF のみ対応しています。`); return; }
    const limit = pdf ? maxPdfSize : maxImageSize;
    const oversized = files.find((file) => file.size > limit);
    if (oversized) { setMessage(`${oversized.name}: 1ファイル${pdf ? "12" : "4"}MB以下にしてください。`); return; }

    const uploadKey = `${section}-${index}-${key}`;
    setUploading(uploadKey); setMessage("");
    try {
      const uploaded: string[] = [];
      for (const file of (multiple ? files.slice(0, 12) : files.slice(0, 1))) {
        const formData = new FormData(); formData.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || `${file.name} のアップロードに失敗しました。`);
        uploaded.push(body.path);
      }
      setContent((current) => ({
        ...current,
        [section]: current[section].map((item, i) => {
          if (i !== index) return item;
          if (multiple) return { ...item, [key]: [...(Array.isArray(item[key]) ? item[key] : []), ...uploaded].slice(0, 12) };
          return { ...item, [key]: uploaded[0] || "" };
        }),
      }));
      setMessage(`${pdf ? "PDF" : "画像"}をアップロードしました。最後に「SAVE & DEPLOY」を押してください。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "アップロードに失敗しました。");
    } finally { setUploading(null); }
  };

  const listValue = (value: unknown) => Array.isArray(value) ? value.join("\n") : "";
  const parseList = (value: string) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

  const renderInput = (label: string, section: SectionKey, index: number, key: string, options?: { multiline?: boolean; list?: boolean; placeholder?: string; primary?: boolean }) => {
    const value = options?.list ? listValue(content[section][index]?.[key]) : content[section][index]?.[key] ?? "";
    return <label className="admin-field"><span>{label}</span>{options?.multiline || options?.list ?
      <textarea value={value} rows={options?.multiline ? 4 : 3} placeholder={options?.placeholder} onChange={(e) => updateItem(section, index, key, options?.list ? parseList(e.target.value) : e.target.value)} /> :
      <input value={value} data-primary-input={options?.primary ? "true" : undefined} placeholder={options?.placeholder} onChange={(e) => updateItem(section, index, key, e.target.value)} />}</label>;
  };

  const renderImageUploader = (label: string, section: SectionKey, index: number, key: string, multiple = false) => {
    const value = content[section][index]?.[key];
    const paths: string[] = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];
    const uploadKey = `${section}-${index}-${key}`;
    const inputId = `image-${uploadKey}`;
    const isUploading = uploading === uploadKey;
    return <div className="admin-upload-field"><div className="admin-upload-label"><span>{label}</span><small>{multiple ? "複数選択可 / 最大12枚" : "1枚"}・画像4MB以下</small></div>
      <div className={`admin-dropzone ${isUploading ? "uploading" : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (canSave && !isUploading) uploadFiles(section, index, key, e.dataTransfer.files, { multiple }); }}>
        <input id={inputId} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple={multiple} disabled={!canSave || isUploading} onChange={(e) => { if (e.target.files) uploadFiles(section, index, key, e.target.files, { multiple }); e.currentTarget.value = ""; }} />
        <label htmlFor={inputId}><strong>{isUploading ? "UPLOADING..." : "画像をドロップ / クリック"}</strong><span>PNG・JPEG・WebP・GIF</span></label>
      </div>
      {paths.length > 0 && <div className={`admin-image-previews ${multiple ? "multiple" : ""}`}>{paths.map((path, p) => <figure key={`${path}-${p}`}><img src={path} alt="" /><figcaption>{path}</figcaption><button type="button" onClick={() => updateItem(section, index, key, multiple ? paths.filter((_, i) => i !== p) : "")}>×</button></figure>)}</div>}
      <label className="admin-field admin-url-fallback"><span>画像パス / URL（手入力も可）</span>{multiple ? <textarea rows={3} value={listValue(value)} onChange={(e) => updateItem(section, index, key, parseList(e.target.value))} /> : <input value={value ?? ""} onChange={(e) => updateItem(section, index, key, e.target.value)} />}</label>
    </div>;
  };

  const renderPdfUploader = (label: string, section: SectionKey, index: number, key: string) => {
    const value = content[section][index]?.[key] ?? "";
    const uploadKey = `${section}-${index}-${key}`;
    const inputId = `pdf-${uploadKey}`;
    const isUploading = uploading === uploadKey;
    return <div className="admin-pdf-field"><div className="admin-upload-label"><span>{label}</span><small>PDF / 12MB以下</small></div>
      <div className={`admin-pdf-drop ${isUploading ? "uploading" : ""}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (canSave && !isUploading) uploadFiles(section, index, key, e.dataTransfer.files, { pdf: true }); }}>
        <input id={inputId} type="file" accept="application/pdf" disabled={!canSave || isUploading} onChange={(e) => { if (e.target.files) uploadFiles(section, index, key, e.target.files, { pdf: true }); e.currentTarget.value = ""; }} />
        <label htmlFor={inputId}>{isUploading ? "UPLOADING..." : value ? "PDFを差し替える" : "PDFをドロップ / 選択"}</label>
        {value && <div className="admin-pdf-current"><a href={value} target="_blank" rel="noreferrer">現在のPDFを開く ↗</a><button type="button" onClick={() => updateItem(section, index, key, "")}>削除</button></div>}
      </div>
      <label className="admin-field admin-url-fallback"><span>PDFパス / URL</span><input value={value} placeholder="/documents/... または https://..." onChange={(e) => updateItem(section, index, key, e.target.value)} /></label>
    </div>;
  };

  const itemHeader = (section: SectionKey, item: any, index: number) => <div className="admin-item-head"><strong>{String(index + 1).padStart(2, "0")} / {item.title || "Untitled"}</strong><div className="admin-item-actions"><button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button><button type="button" onClick={() => moveItem(index, 1)} disabled={index === content[section].length - 1}>↓</button><button type="button" className="danger" onClick={() => deleteItem(index)}>削除</button></div></div>;

  const renderWork = (item: any, index: number) => <div className="admin-item" key={item.id || index}>{itemHeader("works", item, index)}
    <div className="admin-grid">{renderInput("タイトル", "works", index, "title", { primary: true })}{renderInput("種別", "works", index, "type")}{renderInput("ステータス", "works", index, "status")}{renderInput("年", "works", index, "year")}{renderInput("作品URL", "works", index, "url", { placeholder: "https://..." })}</div>
    {renderImageUploader("メイン画像", "works", index, "image")}
    {renderInput("短い説明", "works", index, "subtitle", { multiline: true })}{renderInput("詳細説明", "works", index, "description", { multiline: true })}
    <div className="admin-grid">{renderInput("担当", "works", index, "role")}{renderInput("チーム", "works", index, "team")}{renderInput("タグ", "works", index, "tags", { list: true })}{renderInput("使用技術", "works", index, "tools", { list: true })}</div>
    <details className="admin-detail" open><summary>PLANNER CASE STUDY</summary>
      {renderInput("PLANNER POINT（この作品で見てほしい設計判断）", "works", index, "plannerPoint", { multiline: true })}
      <div className="admin-case-grid">{renderInput("01 / 課題", "works", index, "problem", { multiline: true })}{renderInput("02 / 狙い", "works", index, "intent", { multiline: true })}{renderInput("03 / 判断・仕様", "works", index, "decision", { multiline: true })}{renderInput("04 / 結果・学び", "works", index, "result", { multiline: true })}</div>
      {renderInput("自分の貢献", "works", index, "contribution", { multiline: true })}{renderInput("その他の工夫", "works", index, "challenge", { multiline: true })}{renderInput("ポイント（1行1項目）", "works", index, "highlights", { list: true })}
    </details>
    <details className="admin-detail"><summary>DOCUMENTS / PDF</summary><div className="admin-doc-grid">{renderPdfUploader("企画書", "works", index, "proposalPdf")}{renderPdfUploader("仕様書", "works", index, "specPdf")}{renderPdfUploader("プレゼン資料", "works", index, "presentationPdf")}</div></details>
    <details className="admin-detail"><summary>PLAY / VIDEO / LINKS</summary><div className="admin-grid">{renderInput("PLAY URL", "works", index, "playUrl", { placeholder: "https://..." })}{renderInput("GAMEPLAY VIDEO URL", "works", index, "videoUrl", { placeholder: "https://..." })}{renderInput("GitHub URL", "works", index, "repoUrl", { placeholder: "https://github.com/..." })}</div></details>
    {renderImageUploader("ギャラリー画像", "works", index, "gallery", true)}
  </div>;

  const renderProduct = (item: any, index: number) => <div className="admin-item" key={item.id || index}>{itemHeader("products", item, index)}<div className="admin-grid">{renderInput("タイトル", "products", index, "title", { primary: true })}{renderInput("種別 / フィルター名", "products", index, "type", { placeholder: "GAME / PLANNING / WEB" })}{renderInput("年", "products", index, "year")}{renderInput("補足", "products", index, "meta")}{renderInput("リンクURL", "products", index, "url", { placeholder: "https://..." })}</div>{renderImageUploader("プロダクト画像", "products", index, "image")}{renderInput("説明", "products", index, "description", { multiline: true })}</div>;

  const renderArticle = (item: any, index: number) => <div className="admin-item" key={item.id || index}>{itemHeader("articles", item, index)}<div className="admin-grid">{renderInput("タイトル", "articles", index, "title", { primary: true })}{renderInput("カテゴリ", "articles", index, "category")}{renderInput("日付", "articles", index, "date")}{renderInput("読了時間", "articles", index, "readTime", { placeholder: "6 MIN READ" })}{renderInput("記事URL", "articles", index, "url", { placeholder: "https://..." })}{renderInput("タグ", "articles", index, "tags", { list: true })}</div>{renderImageUploader("記事サムネイル", "articles", index, "image")}{renderInput("概要", "articles", index, "description", { multiline: true })}</div>;

  return <>
    <button className="admin-launcher" type="button" onClick={() => setOpen(true)}>EDIT</button>
    {open && <div className="admin-backdrop" onMouseDown={(e) => { if (e.currentTarget === e.target) setOpen(false); }}><section className="admin-panel" role="dialog" aria-modal="true">
      {!authenticated ? <div className="admin-login"><button className="admin-close" onClick={() => setOpen(false)}>×</button><p className="admin-kicker">PORTFOLIO ADMIN</p><h2>編集する</h2><p>管理パスワードを入力してください。</p><input type="password" value={password} autoFocus onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }} /><button className="admin-primary" onClick={login} disabled={busy || !password}>{busy ? "確認中..." : "LOGIN"}</button>{message && <p className="admin-message">{message}</p>}</div> : <>
        <header className="admin-header"><div><p className="admin-kicker">PORTFOLIO ADMIN</p><h2>CONTENT EDITOR</h2></div><div className="admin-header-actions"><button onClick={logout}>LOGOUT</button><button className="admin-close" onClick={() => setOpen(false)}>×</button></div></header>
        <div className="admin-tabs">{(Object.keys(sectionLabels) as SectionKey[]).map((section) => <button key={section} className={activeSection === section ? "active" : ""} onClick={() => setActiveSection(section)}>{sectionLabels[section]} <span>{content[section].length}</span></button>)}</div>
        <div className="admin-toolbar"><p>追加項目は一番上に作成されます。WORKではCase Study・PDF・PLAY/VIDEOまで設定できます。</p><button onClick={addItem}>＋ 項目を追加</button></div>
        <div className="admin-items">{activeSection === "works" && content.works.map(renderWork)}{activeSection === "products" && content.products.map(renderProduct)}{activeSection === "articles" && content.articles.map(renderArticle)}</div>
        <footer className="admin-savebar"><div>{!canSave && <span className="admin-warning">GitHub保存用トークンが未設定です。</span>}{message && <span className="admin-message">{message}</span>}</div><button className="admin-primary" onClick={save} disabled={busy || Boolean(uploading) || !canSave}>{busy ? "保存中..." : "SAVE & DEPLOY"}</button></footer>
      </>}
    </section></div>}
    <style jsx global>{`
      .admin-launcher{position:fixed;right:18px;bottom:18px;z-index:80;padding:10px 14px;border:1.5px solid #244936;border-radius:999px;background:#fff;color:#315f48;font-size:10px;font-weight:900;letter-spacing:.12em;cursor:pointer;box-shadow:0 5px 18px rgba(0,0,0,.12)}
      .admin-launcher:hover{background:#315f48;color:#fff}.admin-backdrop{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.72);backdrop-filter:blur(7px)}
      .admin-panel{width:min(1120px,100%);max-height:calc(100vh - 40px);overflow:auto;scroll-behavior:smooth;background:#f7f7f7;border:2px solid #111;border-radius:22px;box-shadow:14px 14px 0 #244936;color:#111}.admin-login{position:relative;width:min(480px,100%);margin:auto;padding:54px 42px;background:#fff}.admin-login h2,.admin-header h2{margin:4px 0 12px;font-size:clamp(32px,4vw,54px);letter-spacing:-.055em}.admin-login input{width:100%;padding:14px;margin:18px 0 12px;border:1.5px solid #aaa;border-radius:9px;font-size:16px}.admin-kicker{margin:0;color:#315f48;font-size:10px;font-weight:800;letter-spacing:.16em}.admin-close{width:42px;height:42px;display:grid;place-items:center;border:1.5px solid #111;border-radius:50%;background:#fff;font-size:23px;cursor:pointer}.admin-login .admin-close{position:absolute;top:18px;right:18px}.admin-primary{padding:12px 18px;border:1.5px solid #244936;border-radius:8px;background:#315f48;color:#fff;font-weight:800;cursor:pointer}.admin-primary:disabled{opacity:.35}.admin-message{color:#315f48;font-size:12px;line-height:1.6}.admin-warning{color:#a23b00;font-size:12px;font-weight:700}.admin-header{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:20px 28px;background:rgba(255,255,255,.97);border-bottom:1px solid #d0d0d0;backdrop-filter:blur(12px)}.admin-header h2{margin-bottom:0;font-size:30px}.admin-header-actions{display:flex;align-items:center;gap:10px}.admin-header-actions>button:not(.admin-close){border:0;background:transparent;font-size:10px;font-weight:800;cursor:pointer}.admin-tabs{display:flex;gap:8px;padding:16px 28px;overflow-x:auto;background:#fff;border-bottom:1px solid #ddd}.admin-tabs button{padding:9px 13px;border:1px solid #bbb;border-radius:999px;background:#fff;font-weight:800;cursor:pointer;white-space:nowrap}.admin-tabs button.active{background:#315f48;color:#fff;border-color:#315f48}.admin-tabs span{opacity:.6;margin-left:6px}.admin-toolbar{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 28px}.admin-toolbar p{margin:0;color:#666;font-size:12px;line-height:1.6}.admin-toolbar button{flex:0 0 auto;padding:9px 13px;border:1.5px solid #315f48;border-radius:999px;background:#fff;color:#315f48;font-weight:800;cursor:pointer}.admin-items{display:grid;gap:20px;padding:0 28px 110px}.admin-item{scroll-margin-top:190px;padding:22px;background:#fff;border:1px solid #d3d3d3;border-radius:15px}.admin-item-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-bottom:16px;margin-bottom:18px;border-bottom:1px solid #e2e2e2}.admin-item-actions{display:flex;gap:7px}.admin-item-actions button{min-width:34px;padding:7px 9px;border:1px solid #bbb;border-radius:7px;background:#fff;font-weight:700;cursor:pointer}.admin-item-actions button:disabled{opacity:.3}.admin-item-actions .danger{color:#a40000}.admin-grid,.admin-case-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.admin-field{display:grid;gap:6px;margin-bottom:12px}.admin-field span,.admin-upload-label>span{color:#555;font-size:10px;font-weight:800;letter-spacing:.06em}.admin-field input,.admin-field textarea{width:100%;padding:10px 11px;border:1px solid #c7c7c7;border-radius:8px;background:#fbfbfb;color:#111;font:inherit;font-size:13px;resize:vertical}.admin-field input:focus,.admin-field textarea:focus{outline:2px solid #315f48;outline-offset:-1px;background:#fff}.admin-upload-field,.admin-pdf-field{margin:8px 0 16px;padding:15px;border:1px solid #d7d7d7;border-radius:12px;background:#fafafa}.admin-upload-label{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:9px}.admin-upload-label small{color:#888;font-size:10px}.admin-dropzone,.admin-pdf-drop{position:relative;min-height:94px;display:grid;place-items:center;border:2px dashed #9cb2a3;border-radius:10px;background:#fff}.admin-dropzone.uploading,.admin-pdf-drop.uploading{opacity:.5;pointer-events:none}.admin-dropzone input,.admin-pdf-drop>input{position:absolute;width:1px;height:1px;opacity:0}.admin-dropzone>label,.admin-pdf-drop>label{width:100%;min-height:90px;display:grid;place-content:center;gap:5px;padding:14px;text-align:center;cursor:pointer}.admin-dropzone label strong{font-size:13px}.admin-dropzone label span{color:#777;font-size:10px}.admin-image-previews{display:grid;grid-template-columns:1fr;gap:10px;margin-top:10px}.admin-image-previews.multiple{grid-template-columns:repeat(3,minmax(0,1fr))}.admin-image-previews figure{position:relative;overflow:hidden;margin:0;border:1px solid #ccc;border-radius:8px;background:#fff}.admin-image-previews img{width:100%;aspect-ratio:16/9;display:block;object-fit:cover}.admin-image-previews figcaption{overflow:hidden;padding:6px 34px 6px 8px;color:#777;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.admin-image-previews figure>button{position:absolute;top:5px;right:5px;width:27px;height:27px;border:1px solid #111;border-radius:50%;background:#fff;cursor:pointer}.admin-url-fallback{margin-top:9px;margin-bottom:0}.admin-pdf-current{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 13px 11px}.admin-pdf-current a{color:#315f48;font-size:11px;font-weight:800}.admin-pdf-current button{border:0;background:transparent;color:#a40000;font-size:10px;cursor:pointer}.admin-detail{margin:16px 0;border:1px solid #cedbd2;border-radius:12px;background:#f6faf7}.admin-detail summary{padding:14px 16px;color:#315f48;font-size:11px;font-weight:900;letter-spacing:.08em;cursor:pointer}.admin-detail[open] summary{border-bottom:1px solid #d7e2da}.admin-detail>*:not(summary){margin-left:15px;margin-right:15px}.admin-detail>.admin-case-grid,.admin-detail>.admin-grid,.admin-detail>.admin-doc-grid{margin-top:15px}.admin-doc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.admin-savebar{position:sticky;bottom:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 28px;background:rgba(255,255,255,.97);border-top:1px solid #ccc;backdrop-filter:blur(12px)}.admin-savebar>div{display:grid;gap:4px}
      @media(max-width:700px){.admin-backdrop{padding:8px}.admin-panel{max-height:calc(100vh - 16px);border-radius:14px;box-shadow:6px 6px 0 #244936}.admin-header,.admin-tabs,.admin-toolbar,.admin-items,.admin-savebar{padding-left:15px;padding-right:15px}.admin-grid,.admin-case-grid,.admin-doc-grid{grid-template-columns:1fr}.admin-item-head,.admin-toolbar,.admin-savebar,.admin-upload-label{align-items:flex-start;flex-direction:column}.admin-item-actions{width:100%}.admin-login{padding:54px 22px 32px}.admin-primary{width:100%}.admin-image-previews.multiple{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `}</style>
  </>;
}
