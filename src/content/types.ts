/** 모듈마다 같은 모양으로 쓰는 내용 타입. 실제 내용은 src/content/<모듈>/ 안에 있다 */

/** 증상 유형 — 홈의 카드 하나 */
export type Category = { slug: string; title: string; blurb: string };

export type Guide = {
  id: string;
  /** CATEGORIES 의 title 과 같은 글자 */
  category: string;
  /** 학생이 말하는 그대로의 증상 */
  symptom: string;
  /** 흔한 원인 — 한두 문장 */
  cause: string;
  /** 코드를 열지 않고도 학생이 직접 볼 수 있는 것 */
  checkFirst: string[];
  /** AI 도구에 붙여넣을 말 */
  prompt: string;
};

export type Checklist = {
  id: string;
  /** 언제 보는 목록인지 */
  when: string;
  items: string[];
};

/** 정보 공유 한 묶음 — 모듈 2 · 3 용. 바이브 코딩 모듈은 전용 화면(app/(app)/tips/vibe-tips.tsx)을 쓴다 */
export type TipSection = {
  id: string;
  title: string;
  /** 줄바꿈 그대로 보인다 */
  body: string;
  links?: { label: string; href: string }[];
};
