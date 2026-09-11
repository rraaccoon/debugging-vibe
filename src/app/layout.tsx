import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: { default: "막힘 가이드", template: "%s — 막힘 가이드" },
  description: "바이브 코딩으로 만들다 막혔을 때 보는 곳",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="min-h-dvh bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
