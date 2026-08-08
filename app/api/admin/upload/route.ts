import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
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
  return safe || "image";
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
      return NextResponse.json({ ok: false, error: "画像ファイルを選択してください。" }, { status: 400 });
    }

    const extension = MIME_EXTENSIONS[entry.type];
    if (!extension) {
      return NextResponse.json(
        { ok: false, error: "PNG / JPEG / WebP / GIF のみアップロードできます。" },
        { status: 400 },
      );
    }

    if (entry.size <= 0 || entry.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, error: "画像は1ファイル4MB以下にしてください。" },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await entry.arrayBuffer());
    const shortId = randomUUID().replace(/-/g, "").slice(0, 10);
    const filename = `${Date.now()}-${safeBaseName(entry.name)}-${shortId}.${extension}`;
    const repositoryPath = `public/uploads/${filename}`;
    const publicPath = `/uploads/${filename}`;

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
          message: `Upload portfolio image: ${filename}`,
          content: bytes.toString("base64"),
        }),
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`GitHubへの画像保存に失敗しました (${response.status}) ${detail.slice(0, 180)}`);
    }

    return NextResponse.json({
      ok: true,
      path: publicPath,
      filename,
      message: "画像をアップロードしました。",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "アップロードに失敗しました。" },
      { status: 500 },
    );
  }
}
