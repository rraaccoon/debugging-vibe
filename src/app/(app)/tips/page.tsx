import type { Metadata } from "next";
import { BASICS, OVERUSE, POPULAR, TOOLS } from "@/content/tips";
import { CopyButton } from "@/components/copy-button";
import { PageTransition } from "@/components/page-transition";
import { stagger } from "@/components/ui";

export const metadata: Metadata = { title: "정보 공유" };

const PROMPT_BLOCK =
  "mt-2 -rotate-[0.4deg] whitespace-pre-wrap rounded-xl bg-mark px-4 py-3 font-sans text-sm leading-relaxed shadow-clay-sm";

export default function TipsPage() {
  return (
    <PageTransition>
      <div className="stagger">
        <h1 style={stagger(0)} className="font-display text-3xl leading-tight sm:text-4xl">
          AI를 <span className="marker">잘 쓰는</span> 법
        </h1>
        <p style={stagger(1)} className="mt-3 max-w-prose text-ink-muted">
          스킬 · 훅 · 에이전트 같은 말이 무엇인지, 언제 쓰고 언제 쓰면 안 되는지. 이 수업 기준으로 정리했어요.
        </p>

        <section style={stagger(2)} className="mt-10">
          <h2 className="font-display text-xl">먼저 이것부터 — 도구보다 습관</h2>
          <ul className="mt-3 divide-y divide-line">
            {BASICS.map((b) => (
              <li key={b} className="flex items-start gap-3 py-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-action" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={stagger(3)} className="mt-10 rounded-2xl border border-siren/30 bg-siren-soft p-5 sm:p-6">
          <h2 className="font-display text-xl text-siren-deep">{OVERUSE.title}</h2>
          <p className="mt-2 max-w-prose">{OVERUSE.intro}</p>
          <ul className="mt-3 list-disc pl-5 leading-relaxed">
            {OVERUSE.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-white/80 px-4 py-3 text-sm font-bold leading-relaxed">{OVERUSE.ruleOfThumb}</p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold">도구가 원인인지 확인하는 프롬프트</h3>
            <CopyButton text={OVERUSE.prompt} />
          </div>
          <pre className={PROMPT_BLOCK}>{OVERUSE.prompt}</pre>
        </section>

        <section style={stagger(4)} className="mt-10">
          <h2 className="font-display text-xl">도구 다섯 가지 — 무엇 · 언제 · 주의</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <article key={t.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-5 shadow-clay-sm">
                <h3 className="font-display text-lg leading-tight">{t.title}</h3>
                <p className="text-sm leading-relaxed">{t.what}</p>
                <p className="text-sm leading-relaxed">
                  <span className="font-bold text-action">언제 </span>
                  {t.when}
                </p>
                <p className="text-sm leading-relaxed">
                  <span className="font-bold text-siren-deep">주의 </span>
                  {t.caution}
                </p>
                {t.example && (
                  <details className="mt-1 text-sm">
                    <summary className="font-bold text-ink-muted transition-colors hover:text-ink">써 볼 프롬프트</summary>
                    <div className="mt-2 flex justify-end">
                      <CopyButton text={t.example} />
                    </div>
                    <pre className={PROMPT_BLOCK}>{t.example}</pre>
                  </details>
                )}
              </article>
            ))}
          </div>
        </section>

        <section style={stagger(5)} className="mt-10">
          <h2 className="font-display text-xl">요즘 많이 쓰는 것들</h2>
          <dl className="mt-3 divide-y divide-line">
            {POPULAR.map((p) => (
              <div key={p.name} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
                <dt className="font-bold">{p.name}</dt>
                <dd className="text-ink-muted">{p.what}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </PageTransition>
  );
}
