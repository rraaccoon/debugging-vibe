import type { Metadata } from "next";
import { CHECKLISTS } from "@/content/checklists";
import { PageTransition } from "@/components/page-transition";
import { CHIP, stagger } from "@/components/ui";
import { ChecklistSections } from "./checklist-sections";

export const metadata: Metadata = { title: "체크리스트" };

export default function ChecklistPage() {
  return (
    <PageTransition>
      <div className="stagger">
        <h1 style={stagger(0)} className="font-display text-3xl leading-tight sm:text-4xl">
          하기 전에 <span className="marker">한 번</span> 보세요
        </h1>
        <p style={stagger(1)} className="mt-3 max-w-prose text-ink-muted">
          문제는 생기기 전에 막는 게 제일 빨라요. 체크는 이 화면에서만 남고 새로고침하면 비워져요.
        </p>
        <nav style={stagger(2)} className="mt-6 flex flex-wrap gap-2">
          {CHECKLISTS.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={CHIP}>
              {c.when}
            </a>
          ))}
        </nav>
        <ChecklistSections lists={CHECKLISTS} />
      </div>
    </PageTransition>
  );
}
