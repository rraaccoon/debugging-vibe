import type { Metadata } from "next";
import Link from "next/link";
import { listPosts, PER_PAGE } from "@/lib/db";
import { getUser } from "@/lib/session";
import { getModule } from "@/lib/module";
import { isModuleSlug, moduleLabel } from "@/content/modules";
import { authorLabel, formatDate } from "@/lib/format";
import { PageTransition } from "@/components/page-transition";
import { BUTTON, CHIP, stagger } from "@/components/ui";
import { ModuleSelect } from "./module-select";

export const metadata: Metadata = { title: "질문 게시판" };

const ON = "border-ink bg-ink text-white hover:text-white";

export default async function BoardPage({ searchParams }: { searchParams: Promise<{ page?: string; m?: string }> }) {
  const [{ page: pageParam, m: mParam }, headerModule, viewer] = await Promise.all([searchParams, getModule(), getUser()]);
  // ?m=all 이면 모든 모듈, ?m=<slug> 면 그 모듈, 없으면 헤더에서 고른 모듈
  const mQuery = mParam === "all" || isModuleSlug(mParam) ? mParam : undefined;
  const mod = mQuery === undefined ? headerModule : mQuery === "all" ? null : mQuery;
  const page = Math.max(1, Math.floor(Number(pageParam)) || 1);
  const { posts, total } = await listPosts({ module: mod, page });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const href = (p: number) => {
    const q = new URLSearchParams();
    if (mQuery) q.set("m", mQuery);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `/board?${s}` : "/board";
  };

  return (
    <PageTransition>
      <div className="stagger">
        <div style={stagger(0)} className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl leading-tight sm:text-4xl">질문 게시판</h1>
            <p className="mt-3 max-w-prose text-ink-muted">
              가이드에 없는 문제는 여기에 올리세요. 강사와 다른 팀도 답할 수 있어요.
            </p>
          </div>
          <Link href="/board/new" transitionTypes={["nav-forward"]} className={BUTTON}>
            질문 올리기
          </Link>
        </div>

        <div style={stagger(1)} className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <ModuleSelect value={mod ?? "all"} />
          <span className="ml-auto tabular-nums text-ink-muted">{total}개</span>
        </div>

        {posts.length === 0 ? (
          <p style={stagger(2)} className="mt-14 text-center text-ink-muted">
            {total === 0 ? (
              "아직 질문이 없어요. 첫 질문을 올려 보세요."
            ) : (
              <>
                이 쪽에는 질문이 없어요.{" "}
                <Link href={href(1)} className="underline">
                  첫 쪽으로
                </Link>
              </>
            )}
          </p>
        ) : (
          <ul style={stagger(2)} className="mt-4 flex flex-col gap-3">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/board/${p.id}`}
                  transitionTypes={["nav-forward"]}
                  className="block rounded-2xl border border-line bg-white px-4 py-3.5 shadow-clay-sm transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-clay"
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <span className="font-bold leading-snug">{p.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${p.answerCount ? "bg-action-soft text-action" : "bg-line/70 text-ink-muted"}`}
                    >
                      {p.answerCount ? `답 ${p.answerCount}` : "답 없음"}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {mod === null && (
                      <span className="rounded-full bg-mist px-2 py-0.5 text-xs font-bold text-ink-muted">{moduleLabel(p.module)}</span>
                    )}
                    <span className="text-ink-muted">{authorLabel(p, viewer?.role)}</span>
                    <span className="text-ink-muted">{formatDate(p.createdAt)}</span>
                    {p.reactions.length > 0 && (
                      <span className="ml-auto flex flex-wrap gap-1">
                        {p.reactions.map((r) => (
                          <span key={r.emoji} className="rounded-full border border-line px-2 py-0.5 text-xs">
                            {r.emoji} <b className="text-ink-muted">{r.count}</b>
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {pages > 1 && (
          <nav style={stagger(3)} aria-label="쪽 이동" className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
            {page > 1 && (
              <Link href={href(page - 1)} className={CHIP}>
                ← 이전
              </Link>
            )}
            {/* ponytail: 쪽 번호를 다 보여 준다. 수십 쪽을 넘기면 현재 쪽 앞뒤 몇 개만 남기기 */}
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                className={`${CHIP} min-w-9 text-center tabular-nums ${p === page ? ON : ""}`}
              >
                {p}
              </Link>
            ))}
            {page < pages && (
              <Link href={href(page + 1)} className={CHIP}>
                다음 →
              </Link>
            )}
          </nav>
        )}
      </div>
    </PageTransition>
  );
}
