import type { Metadata } from "next";
import { contentOf } from "@/content";
import { getModule } from "@/lib/module";
import { ComingSoon } from "@/components/coming-soon";
import { PageTransition } from "@/components/page-transition";
import { CHIP, stagger } from "@/components/ui";
import { ChecklistSections } from "./checklist-sections";

export const metadata: Metadata = { title: "예방 점검" };

export default async function ChecklistPage() {
  const mod = await getModule();
  const { checklists } = contentOf(mod);
  return (
    <PageTransition>
      <div className="stagger">
        <h1 style={stagger(0)} className="font-display text-3xl leading-tight sm:text-4xl">
          불나기 전에 <span className="marker">점검</span>하세요
        </h1>
        <p style={stagger(1)} className="mt-3 max-w-prose text-ink-muted">
          불은 나기 전에 막는 게 제일 빨라요. 체크는 이 화면에서만 남고 새로고침하면 비워져요.
        </p>
        {checklists.length === 0 ? (
          <div style={stagger(2)}>
            <ComingSoon module={mod} what="예방 점검" />
          </div>
        ) : (
          <>
            <nav style={stagger(2)} className="mt-6 flex flex-wrap gap-2">
              {checklists.map((c) => (
                <a key={c.id} href={`#${c.id}`} className={CHIP}>
                  {c.when}
                </a>
              ))}
            </nav>
            <ChecklistSections lists={checklists} />
          </>
        )}
      </div>
    </PageTransition>
  );
}
