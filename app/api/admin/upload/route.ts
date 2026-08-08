import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MAX_PDF_SIZE = 12 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, { extension: string; directory: string; label: string }> = {
  "image/png": { extension: "png", directory: "uploads", label: "画像" },
  "image/jpeg": { extension: "jpg", directory: "uploads", label: "画像" },
  "image/webp": { extension: "webp", directory: "uploads", label: "画像" },
  "image/gif": { extension: "gif", directory: "uploads", label: "画像" },
  "application/pdf": { extension: "pdf", directory: "documents", label: "PDF" },
};

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
  return { owner, repo, token };
}

function safeBaseName(name: string) {
  const withoutExtension = name.replace(/\.[^.]+$/, "");
  const safe = withoutExtension
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return safe || "asset";
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, error: "認証が必要です。" }, { status: 401 });
  }

  const { owner, repo, token } = githubConfig();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "PORTFOLIO_GITHUB_TOKEN がVercelに設定されていません。" },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const entry = formData.get("file");

    if (!(entry instanceof File)) {
      return NextResponse.json({ ok: false, error: "ファイルを選択してください。" }, { status: 400 });
    }

    const config = MIME_EXTENSIONS[entry.type];
    if (!config) {
      return NextResponse.json(
        { ok: false, error: "PNG / JPEG / WebP / GIF / PDF のみアップロードできます。" },
        { status: 400 },
      );
    }

    const maxSize = entry.type === "application/pdf" ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
    if (entry.size <= 0 || entry.size > maxSize) {
      const maxMb = Math.round(maxSize / 1024 / 1024);
      return NextResponse.json(
        { ok: false, error: `${config.label}は1ファイル${maxMb}MB以下にしてください。` },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await entry.arrayBuffer());
    const shortId = randomUUID().replace(/-/g, "").slice(0, 10);
    const filename = `${Date.now()}-${safeBaseName(entry.name)}-${shortId}.${config.extension}`;
    const repositoryPath = `public/${config.directory}/${filename}`;
    const publicPath = `/${config.directory}/${filename}`;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${repositoryPath}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: `Upload portfolio ${config.label}: ${filename}`,
          content: bytes.toString("base64"),
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`GitHubへの${config.label}保存に失敗しました (${response.status}) ${detail.slice(0, 180)}`);
    }

    return NextResponse.json({
      ok: true,
      path: publicPath,
      filename,
      kind: entry.type === "application/pdf" ? "pdf" : "image",
      message: `${config.label}をアップロードしました。`,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "アップロードに失敗しました。" },
      { status: 500 },
    );
  }
}
