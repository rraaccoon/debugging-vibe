import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { BUTTON } from "@/components/ui";

export const metadata: Metadata = { title: "질문 게시판" };

export default async function BoardPage() {
  const posts = await listPosts();
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">질문 게시판</h1>
          <p className="mt-2 max-w-prose text-ink-muted">
            가이드에 없는 문제는 여기에 올리세요. 강사와 다른 팀도 답할 수 있어요.
          </p>
        </div>
        <Link href="/board/new" className={BUTTON}>
          질문 올리기
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-12 text-center text-ink-muted">아직 질문이 없어요. 첫 질문을 올려 보세요.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                href={`/board/${p.id}`}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3 hover:bg-white"
              >
                <span className="font-bold">{p.title}</span>
                <span className="text-sm text-ink-muted">{p.author}</span>
                <span className="text-sm text-ink-muted">{formatDate(p.createdAt)}</span>
                <span className={`ml-auto text-sm ${p.answerCount ? "font-bold text-action" : "text-ink-faint"}`}>
                  {p.answerCount ? `답 ${p.answerCount}` : "답 없음"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
