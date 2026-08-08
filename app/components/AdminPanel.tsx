"use client";

import { useState } from "react";

type SectionKey = "works" | "products" | "articles";
type SiteContent = {
  works: any[];
  products: any[];
  articles: any[];
};

const emptyContent: SiteContent = { works: [], products: [], articles: [] };

const sectionLabels: Record<SectionKey, string> = {
  works: "WORK",
  products: "PRODUCTS",
  articles: "ARTICLE",
};

function newItem(section: SectionKey, index: number) {
  const baseId = `${section.slice(0, -1)}-${Date.now()}`;
  if (section === "works") {
    return {
      id: baseId,
      number: String(index + 1).padStart(2, "0"),
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
    number: String(index + 1).padStart(2, "0"),
    date: `${new Date().getFullYear()}.08`,
    category: "ARTICLE",
    title: "新しい記事",
    description: "記事の概要を入力してください。",
    url: "",
    image: "",
  };
}

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [activeSection, setActiveSection] = useState<SectionKey>("works");
  const [busy, setBusy] = useState(false);
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

      const dataResponse = await fetch("/api/admin/content", { cache: "no-store" });
      const dataBody = await dataResponse.json();
      if (!dataResponse.ok) throw new Error(dataBody.error || "コンテンツを取得できませんでした。");

      setContent(dataBody.content);
      setCanSave(Boolean(dataBody.canSave));
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
    setContent((current) => ({
      ...current,
      [activeSection]: [
        ...current[activeSection],
        newItem(activeSection, current[activeSection].length),
      ],
    }));
  };

  const deleteItem = (index: number) => {
    if (!window.confirm("この項目を削除しますか？")) return;
    setContent((current) => ({
      ...current,
      [activeSection]: current[activeSection].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    const list = [...content[activeSection]];
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    setContent((current) => ({ ...current, [activeSection]: list }));
  };

  const save = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "保存に失敗しました。");
      setContent((current) => ({
        ...current,
        works: current.works.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") })),
        articles: current.articles.map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") })),
      }));
      setMessage(body.message || "保存しました。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存に失敗しました。");
    } finally {
      setBusy(false);
    }
  };

  const listValue = (value: unknown) => (Array.isArray(value) ? value.join("\n") : "");
  const parseList = (value: string) => value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);

  const renderInput = (label: string, section: SectionKey, index: number, key: string, options?: { multiline?: boolean; list?: boolean; placeholder?: string }) => {
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
            placeholder={options?.placeholder}
            onChange={(event) => updateItem(section, index, key, event.target.value)}
          />
        )}
      </label>
    );
  };

  const renderWork = (item: any, index: number) => (
    <div className="admin-item" key={item.id || index}>
      <div className="admin-item-head">
        <strong>{String(index + 1).padStart(2, "0")} / {item.title || "Untitled"}</strong>
        <div className="admin-item-actions">
          <button onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
          <button onClick={() => moveItem(index, 1)} disabled={index === content.works.length - 1}>↓</button>
          <button className="danger" onClick={() => deleteItem(index)}>削除</button>
        </div>
      </div>
      <div className="admin-grid">
        {renderInput("タイトル", "works", index, "title")}
        {renderInput("種別", "works", index, "type")}
        {renderInput("ステータス", "works", index, "status")}
        {renderInput("年", "works", index, "year")}
        {renderInput("外部URL", "works", index, "url", { placeholder: "https://..." })}
        {renderInput("メイン画像URL", "works", index, "image", { placeholder: "https://..." })}
      </div>
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
      {renderInput("ギャラリー画像URL（1行1枚）", "works", index, "gallery", { list: true, placeholder: "https://..." })}
    </div>
  );

  const renderProduct = (item: any, index: number) => (
    <div className="admin-item" key={item.id || index}>
      <div className="admin-item-head">
        <strong>{String(index + 1).padStart(2, "0")} / {item.title || "Untitled"}</strong>
        <div className="admin-item-actions">
          <button onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
          <button onClick={() => moveItem(index, 1)} disabled={index === content.products.length - 1}>↓</button>
          <button className="danger" onClick={() => deleteItem(index)}>削除</button>
        </div>
      </div>
      <div className="admin-grid">
        {renderInput("タイトル", "products", index, "title")}
        {renderInput("種別", "products", index, "type")}
        {renderInput("年", "products", index, "year")}
        {renderInput("補足", "products", index, "meta")}
        {renderInput("リンクURL", "products", index, "url", { placeholder: "https://..." })}
        {renderInput("画像URL", "products", index, "image", { placeholder: "https://..." })}
      </div>
      {renderInput("説明", "products", index, "description", { multiline: true })}
    </div>
  );

  const renderArticle = (item: any, index: number) => (
    <div className="admin-item" key={item.id || index}>
      <div className="admin-item-head">
        <strong>{String(index + 1).padStart(2, "0")} / {item.title || "Untitled"}</strong>
        <div className="admin-item-actions">
          <button onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
          <button onClick={() => moveItem(index, 1)} disabled={index === content.articles.length - 1}>↓</button>
          <button className="danger" onClick={() => deleteItem(index)}>削除</button>
        </div>
      </div>
      <div className="admin-grid">
        {renderInput("タイトル", "articles", index, "title")}
        {renderInput("カテゴリ", "articles", index, "category")}
        {renderInput("日付", "articles", index, "date")}
        {renderInput("記事URL", "articles", index, "url", { placeholder: "https://..." })}
        {renderInput("画像URL", "articles", index, "image", { placeholder: "https://..." })}
      </div>
      {renderInput("概要", "articles", index, "description", { multiline: true })}
    </div>
  );

  return (
    <>
      <button className="admin-launcher" type="button" onClick={() => setOpen(true)} aria-label="ポートフォリオを編集">
        EDIT
      </button>

      {open && (
        <div className="admin-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
          <section className="admin-panel" role="dialog" aria-modal="true" aria-label="ポートフォリオ管理画面">
            {!authenticated ? (
              <div className="admin-login">
                <button className="admin-close" onClick={() => setOpen(false)}>×</button>
                <p className="admin-kicker">PORTFOLIO ADMIN</p>
                <h2>編集する</h2>
                <p>管理パスワードを入力してください。</p>
                <input
                  type="password"
                  value={password}
                  autoFocus
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") login(); }}
                />
                <button className="admin-primary" onClick={login} disabled={busy || !password}>{busy ? "確認中..." : "LOGIN"}</button>
                {message && <p className="admin-message">{message}</p>}
              </div>
            ) : (
              <>
                <header className="admin-header">
                  <div><p className="admin-kicker">PORTFOLIO ADMIN</p><h2>CONTENT EDITOR</h2></div>
                  <div className="admin-header-actions">
                    <button onClick={logout}>LOGOUT</button>
                    <button className="admin-close" onClick={() => setOpen(false)}>×</button>
                  </div>
                </header>

                <div className="admin-tabs">
                  {(Object.keys(sectionLabels) as SectionKey[]).map((section) => (
                    <button key={section} className={activeSection === section ? "active" : ""} onClick={() => setActiveSection(section)}>
                      {sectionLabels[section]} <span>{content[section].length}</span>
                    </button>
                  ))}
                </div>

                <div className="admin-toolbar">
                  <p>画像は <strong>https://...</strong> の画像URLを指定してください。</p>
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
                  <button className="admin-primary" onClick={save} disabled={busy || !canSave}>{busy ? "保存中..." : "SAVE & DEPLOY"}</button>
                </footer>
              </>
            )}
          </section>
        </div>
      )}

      <style jsx global>{`
        .admin-launcher { position: fixed; right: 18px; bottom: 18px; z-index: 80; padding: 9px 13px; border: 1.5px solid #0a0a0a; border-radius: 999px; background: #fff; color: #0a0a0a; font: 800 10px/1 Arial, sans-serif; letter-spacing: .12em; cursor: pointer; box-shadow: 0 5px 18px rgba(0,0,0,.12); }
        .admin-launcher:hover { background: #0a0a0a; color: #fff; }
        .admin-backdrop { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 20px; background: rgba(0,0,0,.72); backdrop-filter: blur(7px); }
        .admin-panel { width: min(1120px, 100%); max-height: calc(100vh - 40px); overflow: auto; background: #f7f7f7; border: 2px solid #0a0a0a; border-radius: 22px; box-shadow: 14px 14px 0 #0a0a0a; color: #0a0a0a; }
        .admin-login { position: relative; width: min(480px, 100%); margin: auto; padding: 54px 42px; background: #fff; }
        .admin-login h2, .admin-header h2 { margin: 4px 0 12px; font-size: clamp(32px, 4vw, 54px); letter-spacing: -.055em; }
        .admin-login > p:not(.admin-kicker):not(.admin-message) { color: #666; }
        .admin-login input { width: 100%; padding: 14px; margin: 18px 0 12px; border: 1.5px solid #aaa; border-radius: 9px; font-size: 16px; }
        .admin-kicker { margin: 0; color: #777; font: 800 10px/1.2 Arial, sans-serif; letter-spacing: .16em; }
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
        .admin-toolbar p { margin: 0; color: #666; font-size: 12px; }
        .admin-toolbar button { padding: 9px 13px; border: 1.5px solid #0a0a0a; border-radius: 999px; background: #fff; font-weight: 800; cursor: pointer; }
        .admin-items { display: grid; gap: 20px; padding: 0 28px 110px; }
        .admin-item { padding: 22px; background: #fff; border: 1px solid #d3d3d3; border-radius: 15px; }
        .admin-item-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding-bottom: 16px; margin-bottom: 18px; border-bottom: 1px solid #e2e2e2; }
        .admin-item-actions { display: flex; gap: 7px; }
        .admin-item-actions button { min-width: 34px; padding: 7px 9px; border: 1px solid #bbb; border-radius: 7px; background: #fff; font-weight: 700; cursor: pointer; }
        .admin-item-actions button:disabled { opacity: .3; }
        .admin-item-actions .danger { color: #a40000; }
        .admin-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .admin-field { display: grid; gap: 6px; margin-bottom: 12px; }
        .admin-field span { color: #666; font-size: 10px; font-weight: 800; letter-spacing: .06em; }
        .admin-field input, .admin-field textarea { width: 100%; padding: 10px 11px; border: 1px solid #c7c7c7; border-radius: 8px; background: #fbfbfb; color: #111; font: inherit; font-size: 13px; resize: vertical; }
        .admin-field input:focus, .admin-field textarea:focus { outline: 2px solid #111; outline-offset: -1px; background: #fff; }
        .admin-savebar { position: sticky; bottom: 0; z-index: 5; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 28px; background: rgba(255,255,255,.97); border-top: 1px solid #ccc; backdrop-filter: blur(12px); }
        .admin-savebar > div { display: grid; gap: 4px; }
        @media (max-width: 700px) {
          .admin-backdrop { padding: 8px; }
          .admin-panel { max-height: calc(100vh - 16px); border-radius: 14px; box-shadow: 6px 6px 0 #0a0a0a; }
          .admin-header, .admin-tabs, .admin-toolbar, .admin-items, .admin-savebar { padding-left: 15px; padding-right: 15px; }
          .admin-grid { grid-template-columns: 1fr; }
          .admin-item-head, .admin-toolbar, .admin-savebar { align-items: flex-start; flex-direction: column; }
          .admin-item-actions { width: 100%; }
          .admin-login { padding: 54px 22px 32px; }
          .admin-primary { width: 100%; }
        }
      `}</style>
    </>
  );
}
