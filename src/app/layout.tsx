import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { FireBackground } from "@/components/fire-background";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
  preload: false,
});

const DESCRIPTION = "코드에 불나면 여기로. 불 종류 찾고, 프롬프트 복사하고, AI에게 다시 시키기";

/**
 * 사이트 전체가 로그인 뒤라 검색 노출은 막고(noindex), 단톡방·슬랙에 링크를 올릴 때 미리보기만 예쁘게 나오게 한다.
 * 이미지는 옆의 opengraph-image.png. metadataBase 는 Vercel 이 배포 주소로 자동 채우므로 적지 않는다.
 */
export const metadata: Metadata = {
  title: { default: "디버그 119", template: "%s — 디버그 119" },
  description: DESCRIPTION,
  openGraph: { title: "디버그 119", description: DESCRIPTION, siteName: "디버그 119", locale: "ko_KR", type: "website" },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <FireBackground />
        {children}
      </body>
    </html>
  );
}
