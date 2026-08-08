import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import fallbackContent from "../../../../data/content.json";

export const runtime = "nodejs";

const CONTENT_PATH = "data/content.json";

function sessionToken(secret: string) {
  return createHmac("sha256", secret)
    .update("portfolio-admin-session-v1")
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD;
  const cookie = request.cookies.get("portfolio_admin")?.value ?? "";
  return Boolean(secret) && safeEqual(cookie, sessionToken(secret!));
}

function githubConfig() {
  const repository = process.env.PORTFOLIO_GITHUB_REPOSITORY || "nine0511/portfolio";
  const [owner, repo] = repository.split("/");
  const token = process.env.PORTFOLIO_GITHUB_TOKEN;
  return { owner, repo, token, repository };
}

function sanitizeUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function sanitizeAsset(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("/uploads/") || trimmed.startsWith("/documents/")) &&
    !trimmed.includes("..") &&
    /^\/(uploads|documents)\/[a-zA-Z0-9._/-]+$/.test(trimmed)
  ) {
    return trimmed.slice(0, 700);
  }
  return sanitizeUrl(trimmed);
}

function text(value: unknown, max = 4000) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function stringList(value: unknown, maxItems = 20) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => text(item, 500)).filter(Boolean);
}

function sanitizeContent(input: any) {
  const works = Array.isArray(input?.works) ? input.works.slice(0, 40) : [];
  const products = Array.isArray(input?.products) ? input.products.slice(0, 80) : [];
  const articles = Array.isArray(input?.articles) ? input.articles.slice(0, 100) : [];

  return {
    works: works.map((item: any, index: number) => ({
      id: text(item.id, 80) || `work-${Date.now()}-${index}`,
      number: text(item.number, 8) || String(index + 1).padStart(2, "0"),
      title: text(item.title, 160),
      type: text(item.type, 80),
      status: text(item.status, 80),
      year: text(item.year, 12),
      subtitle: text(item.subtitle, 500),
      description: text(item.description, 5000),
      tags: stringList(item.tags),
      image: sanitizeAsset(item.image),
      url: sanitizeUrl(item.url),
      role: text(item.role, 1000),
      team: text(item.team, 500),
      tools: stringList(item.tools),
      challenge: text(item.challenge, 5000),
      highlights: stringList(item.highlights),
      gallery: stringList(item.gallery, 12).map(sanitizeAsset).filter(Boolean),
      plannerPoint: text(item.plannerPoint, 1200),
      problem: text(item.problem, 5000),
      intent: text(item.intent, 5000),
      decision: text(item.decision, 5000),
      result: text(item.result, 5000),
      contribution: text(item.contribution, 2000),
      proposalPdf: sanitizeAsset(item.proposalPdf),
      specPdf: sanitizeAsset(item.specPdf),
      presentationPdf: sanitizeAsset(item.presentationPdf),
      playUrl: sanitizeUrl(item.playUrl),
      videoUrl: sanitizeUrl(item.videoUrl),
      repoUrl: sanitizeUrl(item.repoUrl),
    })),
    products: products.map((item: any, index: number) => ({
      id: text(item.id, 80) || `product-${Date.now()}-${index}`,
      title: text(item.title, 160),
      type: text(item.type, 80),
      year: text(item.year, 12),
      description: text(item.description, 3000),
      image: sanitizeAsset(item.image),
      url: sanitizeUrl(item.url),
      meta: text(item.meta, 500),
    })),
    articles: articles.map((item: any, index: number) => ({
      id: text(item.id, 80) || `article-${Date.now()}-${index}`,
      number: text(item.number, 8) || String(index + 1).padStart(2, "0"),
      date: text(item.date, 40),
      category: text(item.category, 80),
      title: text(item.title, 200),
      description: text(item.description, 4000),
      url: sanitizeUrl(item.url),
      image: sanitizeAsset(item.image),
      readTime: text(item.readTime, 40),
      tags: stringList(item.tags, 10),
    })),
  };
}

async function fetchGithubContent() {
  const { owner, repo, token } = githubConfig();
  if (!token) return null;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${CONTENT_PATH}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) throw new Error(`GitHubからデータを取得できませんでした (${response.status})`);
  const payload = await response.json();
  const json = Buffer.from(payload.content, "base64").toString("utf8");
  return { content: JSON.parse(json), sha: payload.sha as string };
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const remote = await fetchGithubContent();
    return NextResponse.json({
      ok: true,
      content: remote?.content ?? fallbackContent,
      canSave: Boolean(githubConfig().token),
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "取得に失敗しました。" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "認証が必要です。" }, { status: 401 });
  }

  const { owner, repo, token, repository } = githubConfig();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "PORTFOLIO_GITHUB_TOKEN がVercelに設定されていません。" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const content = sanitizeContent(body.content);
    const current = await fetchGithubContent();
    if (!current) throw new Error("現在のコンテンツを取得できませんでした。");

    const encoded = Buffer.from(`${JSON.stringify(content, null, 2)}\n`, "utf8").toString("base64");
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${CONTENT_PATH}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: "Update portfolio content from admin panel",
          content: encoded,
          sha: current.sha,
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`GitHubへの保存に失敗しました (${response.status}) ${detail.slice(0, 180)}`);
    }

    return NextResponse.json({
      ok: true,
      repository,
      message: "保存しました。Vercelの再デプロイ後に公開サイトへ反映されます。",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "保存に失敗しました。" },
      { status: 500 },
    );
  }
}
