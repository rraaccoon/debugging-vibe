import Link from "next/link";
import { ViewTransition } from "react";
import { contentOf } from "@/content";
import { getModule } from "@/lib/module";
import { FireScene, FlameIcon } from "@/components/art";
import { ComingSoon } from "@/components/coming-soon";
import { PageTransition } from "@/components/page-transition";
import { stagger } from "@/components/ui";

export default async function HomePage() {
  const mod = await getModule();
  const { categories, guides } = contentOf(mod);
  return (
    <PageTransition>
      <div>
        <section className="grid items-center gap-6 sm:grid-cols-[1fr_18rem]">
          <div>
            <h1 className="animate-reveal font-display text-3xl leading-tight sm:text-4xl">
              불났어요?
              <br />
              어디가 타는지부터 보세요
            </h1>
            <p className="mt-3 max-w-prose animate-reveal text-ink-muted [animation-delay:70ms]">
              지금 겪는 것과 가장 가까운 불 종류를 고르세요. 안에서 증상을 열면 원인과 AI 도구에 붙여넣을 진압 지시가
              있어요.
            </p>
          </div>
          <FireScene className="fire-scene w-full max-w-xs animate-reveal justify-self-center [animation-delay:140ms] sm:justify-self-end" />
        </section>

        {categories.length === 0 ? (
          <ComingSoon module={mod} what="진압 매뉴얼" />
        ) : (
          <ul className="stagger mt-8 grid gap-3 sm:grid-cols-2">
            {categories.map((c, i) => {
              const count = guides.filter((g) => g.category === c.title).length;
              return (
                <li key={c.slug} style={stagger(2 + i)}>
                  <Link
                    href={`/guide/${c.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-white p-5 shadow-clay-sm transition-all duration-200 ease-out-expo hover:-translate-y-1 hover:border-siren/40 hover:shadow-clay active:translate-y-0 active:scale-[0.98]"
                  >
                    <span className="flex items-start gap-2">
                      <FlameIcon className="mt-0.5 size-5 shrink-0" />
                      <ViewTransition name={`cat-${c.slug}`} share="morph" default="none">
                        <span className="font-display text-xl leading-tight">{c.title}</span>
                      </ViewTransition>
                    </span>
                    <span className="text-sm text-ink-muted">{c.blurb}</span>
                    <span className="mt-auto pt-2 text-sm font-bold text-action">증상 {count}개 보기</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
