import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/lib/db";
import { getUser } from "@/lib/session";
import { authorLabel, formatDate } from "@/lib/format";
import { PageTransition } from "@/components/page-transition";
import { BUTTON, stagger } from "@/components/ui";

export const metadata: Metadata = { title: "질문 게시판" };

export default async function BoardPage() {
  const [posts, viewer] = await Promise.all([listPosts(), getUser()]);
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

        {posts.length === 0 ? (
          <p style={stagger(1)} className="mt-14 text-center text-ink-muted">
            아직 질문이 없어요. 첫 질문을 올려 보세요.
          </p>
        ) : (
          <ul style={stagger(1)} className="mt-6 flex flex-col gap-1">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/board/${p.id}`}
                  transitionTypes={["nav-forward"]}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl px-3 py-3 transition-all duration-200 ease-out-expo hover:translate-x-1 hover:bg-mist"
                >
                  <span className="font-bold">{p.title}</span>
                  <span className="text-sm text-ink-muted">{authorLabel(p, viewer?.role)}</span>
                  <span className="text-sm text-ink-faint">{formatDate(p.createdAt)}</span>
                  <span
                    className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-bold ${p.answerCount ? "bg-action-soft text-action" : "bg-line/70 text-ink-muted"}`}
                  >
                    {p.answerCount ? `답 ${p.answerCount}` : "답 없음"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
