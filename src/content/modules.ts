/**
 * 수업 모듈. 강사가 다음 모듈을 시작하면 CURRENT_MODULE 만 바꾼다.
 * 가이드 · 체크리스트 · 정보 공유 내용은 src/content/<slug>/ 아래에, 질문은 posts.module 에 slug 로 저장된다.
 */
export const MODULES = [
  { slug: "vibe", short: "M1", name: "바이브 코딩" },
  { slug: "spring", short: "M2", name: "Java · Spring 백엔드" },
  { slug: "next", short: "M3", name: "TypeScript · Next.js 프론트엔드" },
] as const;

export type ModuleSlug = (typeof MODULES)[number]["slug"];

/** 지금 진행 중인 모듈 — 처음 온 사람은 이 모듈로 본다 */
export const CURRENT_MODULE: ModuleSlug = "vibe";

export const isModuleSlug = (v: unknown): v is ModuleSlug => MODULES.some((m) => m.slug === v);

/** "M2 Java · Spring 백엔드" 처럼. 모르는 slug 는 그대로 돌려준다(옛 글 대비) */
export const moduleLabel = (slug: string): string => {
  const m = MODULES.find((x) => x.slug === slug);
  return m ? `${m.short} ${m.name}` : slug;
};
