import type { Metadata } from "next";
import { contentOf } from "@/content";
import { getModule } from "@/lib/module";
import { ComingSoon } from "@/components/coming-soon";
import { PageTransition } from "@/components/page-transition";
import { stagger } from "@/components/ui";
import { VibeTips } from "./vibe-tips";

export const metadata: Metadata = { title: "정보 공유" };

const LINK = "text-action underline decoration-action/30 underline-offset-2 transition-colors hover:decoration-action";

/** 바이브 코딩 모듈은 전용 화면(vibe-tips.tsx). 다른 모듈은 src/content/<모듈>/tips.ts 의 묶음을 그대로 보여 준다 */
export default async function TipsPage() {
  const mod = await getModule();
  if (mod === "vibe") return <VibeTips />;
  const { tips } = contentOf(mod);
  return (
    <PageTransition>
      <div className="stagger">
        <h1 style={stagger(0)} className="font-display text-3xl leading-tight sm:text-4xl">
          정보 공유
        </h1>
        {tips.length === 0 ? (
          <div style={stagger(1)}>
            <ComingSoon module={mod} what="정보 공유" />
          </div>
        ) : (
          tips.map((t, i) => (
            <section key={t.id} id={t.id} style={stagger(1 + i)} className="mt-10 scroll-mt-20">
              <h2 className="font-display text-xl">{t.title}</h2>
              <p className="mt-2 max-w-prose whitespace-pre-wrap leading-relaxed">{t.body}</p>
              {t.links && t.links.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {t.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noreferrer" className={LINK}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))
        )}
      </div>
    </PageTransition>
  );
}
