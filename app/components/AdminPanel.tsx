"use client";

import { useState } from "react";

type SectionKey = "works" | "products" | "articles";
type SiteContent = { works: any[]; products: any[]; articles: any[] };

const emptyContent: SiteContent = { works: [], products: [], articles: [] };
const acceptedImageTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const maxImageSize = 4 * 1024 * 1024;

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
      type: "PROJECT",
      status: "NEW",
      year: String(new Date().getFullYear()),
      subtitle: "作品の短い説明",
      description: "作品の詳細説明を入力してください。",
      tags: [],
      image: "",
      url: "",
      role: "",
      team: "",
      tools: [],
      challenge: "",
      highlights: [],
      gallery: [],
    };
  }
  if (section === "products") {
    return {
      id: baseId,
      title: "新しいPRODUCT",
      type: "PROJECT",
      year: String(new Date().getFullYear()),
      description: "プロダクトの説明を入力してください。",
      image: "",
      url: "",
      meta: "",
    };
  }
  return {
    id: baseId,
    number: "01",
    date: `${new Date().getFullYear()}.08`,
    category: "ARTICLE",
    title: "新しい記事",
    description: "記事の概要を入力してください。",
    url: "",
    image: "",
  };
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    works: content.works.map((item, index) => ({
      ...item,
      number: String(index + 1).padStart(2, "0"),
    })),
    articles: content.articles.map((item, index) => ({
      ...item,
      number: String(index + 1).padStart(2, "0"),
    })),
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
    setBusy(true);
    setMessage("");
    try {
      const auth = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const authBody = await auth.json();
      if (!auth.ok) throw new Error(authBody.error || "認証に失敗しました。");

      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "コンテンツを取得できませんでした。");

      setContent(normalizeContent(body.content));
      setCanSave(Boolean(body.canSave));
      setAuthenticated(true);
      setPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "エラーが発生しました。");
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setContent(emptyContent);
    setOpen(false);
    setMessage("");
  };

  const updateItem = (section: SectionKey, index: number, key: string, value: any) => {
    setContent((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setContent((current) => {
      const next = {
        ...current,
        [activeSection]: [newItem(activeSection), ...current[activeSection]],
      } as SiteContent;
      return normalizeContent(next);
    });
    setMessage("新しい項目を先頭に追加しました。");

    window.setTimeout(() => {
      const firstItem = document.querySelector<HTMLElement>(".admin-items .admin-item:first-child");
      firstItem?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        const primaryInput = firstItem?.querySelector<HTMLInputElement>("[data-primary-input='true']");
        primaryInput?.focus();
        primaryInput?.select();
      }, 250);
    }, 0);
  };

  const deleteItem = (index: number) => {
    if (!window.confirm("この項目を削除しますか？")) return;
    setContent((current) => normalizeContent({
      ...current,
      [activeSection]: current[activeSection].filter((_, itemIndex) => itemIndex !== index),
    } as SiteContent));
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
    setContent(normalized);
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: normalized }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "保存に失敗しました。");
      setMessage(body.message || "保存しました。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存に失敗しました。");
    } finally {
      setBusy(false);
    }
  };

  const uploadImages = async (
    section: SectionKey,
    index: number,
    key: string,
    fileList: FileList | File[],
    multiple = false,
  ) => {
    const files = Array.from(fileList);
    if (!files.length) return;

    const invalid = files.find((file) => !acceptedImageTypes.includes(file.type));
    if (invalid) {
      setMessage(`${invalid.name}: PNG / JPEG / WebP / GIF のみ対応しています。`);
      return;
    }
    const oversized = files.find((file) => file.size > maxImageSize);
    if (oversized) {
      setMessage(`${oversized.name}: 1ファイル4MB以下にしてください。`);
      return;
    }

    const uploadKey = `${section}-${index}-${key}`;
    setUploading(uploadKey);
    setMessage("");

    try {
      const uploadedPaths: string[] = [];
      const filesToUpload = multiple ? files.slice(0, 12) : files.slice(0, 1);
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || `${file.name} のアップロードに失敗しました。`);
        uploadedPaths.push(body.path);
      }

      setContent((current) => ({
        ...current,
        [section]: current[section].map((item, itemIndex) => {
          if (itemIndex !== index) return item;
          if (multiple) {
            const previous = Array.isArray(item[key]) ? item[key] : [];
            return { ...item, [key]: [...previous, ...uploadedPaths].slice(0, 12) };
          }
          return { ...item, [key]: uploadedPaths[0] || "" };
        }),
      }));
      setMessage(`${uploadedPaths.length}枚の画像をアップロードしました。最後に「SAVE & DEPLOY」を押してください。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "画像アップロードに失敗しました。");
    } finally {
      setUploading(null);
    }
  };

  const listValue = (value: unknown) => (Array.isArray(value) ? value.join("\n") : "");
  const parseList = (value: string) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

  const renderInput = (
    label: string,
    section: SectionKey,
    index: number,
    key: string,
    options?: { multiline?: boolean; list?: boolean; placeholder?: string; primary?: boolean },
  ) => {
    const item = content[section][index];
    const value = options?.list ? listValue(item[key]) : item[key] ?? "";
    return (
      <label className="admin-field">
        <span>{label}</span>
        {options?.multiline || options?.list ? (
          <textarea
            value={value}
            placeholder={options?.placeholder}
            rows={options?.multiline ? 4 : 3}
            onChange={(event) => updateItem(section, index, key, options?.list ? parseList(event.target.value) : event.target.value)}
          />
        ) : (
          <input
            value={value}
            data-primary-input={options?.primary ? "true" : undefined}
            placeholder={options?.placeholder}
            onChange={(event) => updateItem(section, index, key, event.target.value)}
          />
        )}
      </label>
    );
  };

  const renderImageUploader = (
    label: string,
    section: SectionKey,
    index: number,
    key: string,
    multiple = false,
  ) => {
    const uploadKey = `${section}-${index}-${key}`;
    const item = content[section][index];
    const value = item?.[key];
    const paths: string[] = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];
    const isUploading = uploading === uploadKey;
    const inputId = `upload-${uploadKey}`;

    return (
      <div className="admin-upload-field">
        <div className="admin-upload-label">
          <span>{label}</span>
          <small>{multiple ? "複数選択可・最大12枚" : "1枚"} / PNG・JPEG・WebP・GIF / 4MB以下</small>
        </div>
        <div
          className={`admin-dropzone ${isUploading ? "uploading" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
          }}
          onDrop={(event) => {
            event.preventDefault();
            if (!canSave || isUploading) return;
            uploadImages(section, index, key, event.dataTransfer.files, multiple);
          }}
        >
          <input
            id={inputId}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple={multiple}
            disabled={!canSave || isUploading}
            onChange={(event) => {
              if (event.target.files) uploadImages(section, index, key, event.target.files, multiple);
              event.currentTarget.value = "";
            }}
          />
          <label htmlFor={inputId}>
            <strong>{isUploading ? "UPLOADING..." : "画像をここにドロップ"}</strong>
            <span>{canSave ? "またはクリックしてファイルを選択" : "GitHub保存用トークンを設定してください"}</span>
          </label>
        </div>

        {paths.length > 0 && (
          <div className={`admin-image-previews ${multiple ? "multiple" : ""}`}>
            {paths.map((path, pathIndex) => (
              <figure key={`${path}-${pathIndex}`}>
                <img src={path} alt={`${label} ${pathIndex + 1}`} />
                <figcaption title={path}>{path}</figcaption>
                <button
                  type="button"
                  onClick={() => {
                    if (multiple) updateItem(section, index, key, paths.filter((_, currentIndex) => currentIndex !== pathIndex));
                    else updateItem(section, index, key, "");
                  }}
                >×</button>
              </figure>
            ))}
          </div>
        )}

        <label className="admin-field admin-url-fallback">
          <span>{multiple ? "画像パス / URL（1行1枚・手入力も可）" : "画像パス / URL（手入力も可）"}</span>
          {multiple ? (
            <textarea rows={3} value={listValue(value)} placeholder="/uploads/... または https://..." onChange={(event) => updateItem(section, index, key, parseList(event.target.value))} />
          ) : (
            <input value={value ?? ""} placeholder="/uploads/... または https://..." onChange={(event) => updateItem(section, index, key, event.target.value)} />
          )}
        </label>
      </div>
    );
  };

  const itemHeader = (section: SectionKey, item: any, index: number) => (
    <div className="admin-item-head">
      <strong>{String(index + 1).padStart(2, "0")} / {item.title || "Untitled"}</strong>
      <div className="admin-item-actions">
        <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
        <button type="button" onClick={() => moveItem(index, 1)} disabled={index === content[section].length - 1}>↓</button>
        <button type="button" className="danger" onClick={() => deleteItem(index)}>削除</button>
      </div>
    </div>
  );

  const renderWork = (item: any, index: number) => (
    <div className="admin-item" key={item.id || index}>
      {itemHeader("works", item, index)}
      <div className="admin-grid">
        {renderInput("タイトル", "works", index, "title", { primary: true })}
        {renderInput("種別", "works", index, "type")}
        {renderInput("ステータス", "works", index, "status")}
        {renderInput("年", "works", index, "year")}
        {renderInput("外部URL", "works", index, "url", { placeholder: "https://..." })}
      </div>
      {renderImageUploader("メイン画像", "works", index, "image")}
      {renderInput("短い説明", "works", index, "subtitle", { multiline: true })}
      {renderInput("詳細説明", "works", index, "description", { multiline: true })}
      <div className="admin-grid">
        {renderInput("担当", "works", index, "role")}
        {renderInput("チーム", "works", index, "team")}
      </div>
      <div className="admin-grid">
        {renderInput("タグ（改行またはカンマ区切り）", "works", index, "tags", { list: true })}
        {renderInput("使用技術（改行またはカンマ区切り）", "works", index, "tools", { list: true })}
      </div>
      {renderInput("工夫したこと", "works", index, "challenge", { multiline: true })}
      {renderInput("ポイント（1行1項目）", "works", index, "highlights", { list: true })}
      {renderImageUploader("ギャラリー画像", "works", index, "gallery", true)}
    </div>
  );

  const renderProduct = (item: any, index: number) => (
    <div className="admin-item" key={item.id || index}>
      {itemHeader("products", item, index)}
      <div className="admin-grid">
        {renderInput("タイトル", "products", index, "title", { primary: true })}
        {renderInput("種別", "products", index, "type")}
        {renderInput("年", "products", index, "year")}
        {renderInput("補足", "products", index, "meta")}
        {renderInput("リンクURL", "products", index, "url", { placeholder: "https://..." })}
      </div>
      {renderImageUploader("プロダクト画像", "products", index, "image")}
      {renderInput("説明", "products", index, "description", { multiline: true })}
    </div>
  );

  const renderArticle = (item: any, index: number) => (
    <div className="admin-item" key={item.id || index}>
      {itemHeader("articles", item, index)}
      <div className="admin-grid">
        {renderInput("タイトル", "articles", index, "title", { primary: true })}
        {renderInput("カテゴリ", "articles", index, "category")}
        {renderInput("日付", "articles", index, "date")}
        {renderInput("記事URL", "articles", index, "url", { placeholder: "https://..." })}
      </div>
      {renderImageUploader("記事サムネイル", "articles", index, "image")}
      {renderInput("概要", "articles", index, "description", { multiline: true })}
    </div>
  );

  return (
    <>
      <button className="admin-launcher" type="button" onClick={() => setOpen(true)} aria-label="ポートフォリオを編集">EDIT</button>

      {open && (
        <div className="admin-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
          <section className="admin-panel" role="dialog" aria-modal="true" aria-label="ポートフォリオ管理画面">
            {!authenticated ? (
              <div className="admin-login">
                <button className="admin-close" onClick={() => setOpen(false)}>×</button>
                <p className="admin-kicker">PORTFOLIO ADMIN</p>
                <h2>編集する</h2>
                <p>管理パスワードを入力してください。</p>
                <input type="password" value={password} autoFocus placeholder="Password" onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") login(); }} />
                <button className="admin-primary" onClick={login} disabled={busy || !password}>{busy ? "確認中..." : "LOGIN"}</button>
                {message && <p className="admin-message">{message}</p>}
              </div>
            ) : (
              <>
                <header className="admin-header">
                  <div><p className="admin-kicker">PORTFOLIO ADMIN</p><h2>CONTENT EDITOR</h2></div>
                  <div className="admin-header-actions"><button onClick={logout}>LOGOUT</button><button className="admin-close" onClick={() => setOpen(false)}>×</button></div>
                </header>

                <div className="admin-tabs">
                  {(Object.keys(sectionLabels) as SectionKey[]).map((section) => (
                    <button key={section} className={activeSection === section ? "active" : ""} onClick={() => setActiveSection(section)}>
                      {sectionLabels[section]} <span>{content[section].length}</span>
                    </button>
                  ))}
                </div>

                <div className="admin-toolbar">
                  <p>「＋ 項目を追加」で新しい項目が一番上に追加され、そのままタイトルを編集できます。</p>
                  <button onClick={addItem}>＋ 項目を追加</button>
                </div>

                <div className="admin-items">
                  {activeSection === "works" && content.works.map(renderWork)}
                  {activeSection === "products" && content.products.map(renderProduct)}
                  {activeSection === "articles" && content.articles.map(renderArticle)}
                </div>

                <footer className="admin-savebar">
                  <div>
                    {!canSave && <span className="admin-warning">GitHub保存用トークンが未設定です。</span>}
                    {message && <span className="admin-message">{message}</span>}
                  </div>
                  <button className="admin-primary" onClick={save} disabled={busy || Boolean(uploading) || !canSave}>{busy ? "保存中..." : "SAVE & DEPLOY"}</button>
                </footer>
              </>
            )}
          </section>
        </div>
      )}

      <style jsx global>{`
        .admin-launcher { position: fixed; right: 18px; bottom: 18px; z-index: 80; padding: 9px 13px; border: 1.5px solid #0a0a0a; border-radius: 999px; background: #fff; color: #0a0a0a; font-size: 10px; font-weight: 800; letter-spacing: .12em; cursor: pointer; box-shadow: 0 5px 18px rgba(0,0,0,.12); }
        .admin-launcher:hover { background: #0a0a0a; color: #fff; }
        .admin-backdrop { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 20px; background: rgba(0,0,0,.72); backdrop-filter: blur(7px); }
        .admin-panel { width: min(1120px, 100%); max-height: calc(100vh - 40px); overflow: auto; scroll-behavior: smooth; background: #f7f7f7; border: 2px solid #0a0a0a; border-radius: 22px; box-shadow: 14px 14px 0 #0a0a0a; color: #0a0a0a; }
        .admin-login { position: relative; width: min(480px, 100%); margin: auto; padding: 54px 42px; background: #fff; }
        .admin-login h2, .admin-header h2 { margin: 4px 0 12px; font-size: clamp(32px, 4vw, 54px); letter-spacing: -.055em; }
        .admin-login > p:not(.admin-kicker):not(.admin-message) { color: #666; }
        .admin-login input { width: 100%; padding: 14px; margin: 18px 0 12px; border: 1.5px solid #aaa; border-radius: 9px; font-size: 16px; }
        .admin-kicker { margin: 0; color: #777; font-size: 10px; font-weight: 800; letter-spacing: .16em; }
        .admin-close { width: 42px; height: 42px; display: grid; place-items: center; border: 1.5px solid #0a0a0a; border-radius: 50%; background: #fff; font-size: 23px; cursor: pointer; }
        .admin-login .admin-close { position: absolute; top: 18px; right: 18px; }
        .admin-primary { padding: 12px 18px; border: 1.5px solid #0a0a0a; border-radius: 8px; background: #0a0a0a; color: #fff; font-weight: 800; cursor: pointer; }
        .admin-primary:disabled { opacity: .35; cursor: default; }
        .admin-message { color: #333; font-size: 12px; line-height: 1.6; }
        .admin-warning { color: #a23b00; font-size: 12px; font-weight: 700; }
        .admin-header { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 28px; background: rgba(255,255,255,.96); border-bottom: 1px solid #d0d0d0; backdrop-filter: blur(12px); }
        .admin-header h2 { margin-bottom: 0; font-size: 30px; }
        .admin-header-actions { display: flex; align-items: center; gap: 10px; }
        .admin-header-actions > button:not(.admin-close) { border: 0; background: transparent; font-size: 10px; font-weight: 800; letter-spacing: .1em; cursor: pointer; }
        .admin-tabs { display: flex; gap: 8px; padding: 18px 28px; overflow-x: auto; background: #fff; border-bottom: 1px solid #ddd; }
        .admin-tabs button { padding: 9px 13px; border: 1px solid #bbb; border-radius: 999px; background: #fff; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .admin-tabs button.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
        .admin-tabs span { opacity: .55; margin-left: 6px; }
        .admin-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 28px; }
        .admin-toolbar p { margin: 0; color: #666; font-size: 12px; line-height: 1.6; }
        .admin-toolbar button { flex: 0 0 auto; padding: 9px 13px; border: 1.5px solid #315f48; border-radius: 999px; background: #315f48; color: #fff; font-weight: 800; cursor: pointer; }
        .admin-toolbar button:hover { background: #244936; }
        .admin-items { display: grid; gap: 20px; padding: 0 28px 110px; scroll-margin-top: 160px; }
        .admin-item { padding: 22px; scroll-margin-top: 165px; background: #fff; border: 1px solid #d3d3d3; border-radius: 15px; }
        .admin-item:first-child { border-color: #9cb2a3; }
        .admin-item-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding-bottom: 16px; margin-bottom: 18px; border-bottom: 1px solid #e2e2e2; }
        .admin-item-actions { display: flex; gap: 7px; }
        .admin-item-actions button { min-width: 34px; padding: 7px 9px; border: 1px solid #bbb; border-radius: 7px; background: #fff; font-weight: 700; cursor: pointer; }
        .admin-item-actions button:disabled { opacity: .3; }
        .admin-item-actions .danger { color: #a40000; }
        .admin-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .admin-field { display: grid; gap: 6px; margin-bottom: 12px; }
        .admin-field span, .admin-upload-label > span { color: #666; font-size: 10px; font-weight: 800; letter-spacing: .06em; }
        .admin-field input, .admin-field textarea { width: 100%; padding: 10px 11px; border: 1px solid #c7c7c7; border-radius: 8px; background: #fbfbfb; color: #111; font: inherit; font-size: 13px; resize: vertical; }
        .admin-field input:focus, .admin-field textarea:focus { outline: 2px solid #315f48; outline-offset: -1px; background: #fff; }
        .admin-upload-field { margin: 7px 0 18px; padding: 16px; border: 1px solid #d7d7d7; border-radius: 12px; background: #fafafa; }
        .admin-upload-label { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 10px; }
        .admin-upload-label small { color: #888; font-size: 10px; }
        .admin-dropzone { position: relative; min-height: 118px; display: grid; place-items: center; border: 2px dashed #aaa; border-radius: 11px; background: #fff; transition: border-color .18s ease, background .18s ease; }
        .admin-dropzone:hover { border-color: #315f48; background: #f3f7f4; }
        .admin-dropzone.uploading { opacity: .55; pointer-events: none; }
        .admin-dropzone input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
        .admin-dropzone label { width: 100%; min-height: 114px; display: grid; place-content: center; gap: 6px; padding: 18px; text-align: center; cursor: pointer; }
        .admin-dropzone label strong { font-size: 13px; letter-spacing: .03em; }
        .admin-dropzone label span { color: #777; font-size: 11px; }
        .admin-image-previews { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 12px; }
        .admin-image-previews.multiple { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .admin-image-previews figure { position: relative; overflow: hidden; margin: 0; border: 1px solid #ccc; border-radius: 9px; background: #fff; }
        .admin-image-previews img { width: 100%; aspect-ratio: 16 / 9; display: block; object-fit: cover; background: #eee; }
        .admin-image-previews figcaption { overflow: hidden; padding: 7px 34px 7px 8px; color: #777; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
        .admin-image-previews figure > button { position: absolute; top: 6px; right: 6px; width: 27px; height: 27px; display: grid; place-items: center; border: 1px solid #111; border-radius: 50%; background: rgba(255,255,255,.94); color: #111; font-size: 17px; cursor: pointer; }
        .admin-url-fallback { margin-top: 10px; margin-bottom: 0; }
        .admin-savebar { position: sticky; bottom: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 28px; background: rgba(255,255,255,.97); border-top: 1px solid #ccc; backdrop-filter: blur(12px); }
        .admin-savebar > div { display: grid; gap: 4px; }
        @media (max-width: 700px) {
          .admin-backdrop { padding: 8px; }
          .admin-panel { max-height: calc(100vh - 16px); border-radius: 14px; box-shadow: 6px 6px 0 #0a0a0a; }
          .admin-header, .admin-tabs, .admin-toolbar, .admin-items, .admin-savebar { padding-left: 15px; padding-right: 15px; }
          .admin-grid { grid-template-columns: 1fr; }
          .admin-item-head, .admin-toolbar, .admin-savebar, .admin-upload-label { align-items: flex-start; flex-direction: column; }
          .admin-item-actions { width: 100%; }
          .admin-login { padding: 54px 22px 32px; }
          .admin-primary { width: 100%; }
          .admin-image-previews.multiple { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </>
  );
}
