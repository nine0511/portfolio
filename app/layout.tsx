import type { Metadata } from "next";
import "./globals.css";
import "./portfolio-overrides.css";

export const metadata: Metadata = {
  title: "Portfolio | nine0511",
  description: "Personal portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
