import type { ModuleSlug } from "./modules";
import type { Category, Checklist, Guide, TipSection } from "./types";
import { CATEGORIES as vibeCategories, GUIDES as vibeGuides } from "./vibe/guides";
import { CHECKLISTS as vibeChecklists } from "./vibe/checklists";
import { CATEGORIES as springCategories, GUIDES as springGuides } from "./spring/guides";
import { CHECKLISTS as springChecklists } from "./spring/checklists";
import { TIPS as springTips } from "./spring/tips";
import { CATEGORIES as nextCategories, GUIDES as nextGuides } from "./next/guides";
import { CHECKLISTS as nextChecklists } from "./next/checklists";
import { TIPS as nextTips } from "./next/tips";

export type ModuleContent = { categories: Category[]; guides: Guide[]; checklists: Checklist[]; tips: TipSection[] };

/** 모듈 slug → 그 모듈의 내용. 새 모듈이 생기면 modules.ts 와 여기에 한 줄씩 */
const CONTENT: Record<ModuleSlug, ModuleContent> = {
  // 바이브 코딩의 정보 공유는 구성이 특별해 전용 화면을 쓴다 — tips 는 비워 둔다
  vibe: { categories: vibeCategories, guides: vibeGuides, checklists: vibeChecklists, tips: [] },
  spring: { categories: springCategories, guides: springGuides, checklists: springChecklists, tips: springTips },
  next: { categories: nextCategories, guides: nextGuides, checklists: nextChecklists, tips: nextTips },
};

export const contentOf = (m: ModuleSlug): ModuleContent => CONTENT[m];
