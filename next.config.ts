import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 질문 · 답에 스크린샷(최대 5장 · 각 800KB 이하)을 실어 보내므로 서버 액션 본문 한도를 올린다 (기본 1MB · Vercel 상한 4.5MB)
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
};

export default nextConfig;
