import type { Metadata } from "next";
import Link from "next/link";
import { getModule } from "@/lib/module";
import { PageTransition } from "@/components/page-transition";
import { stagger } from "@/components/ui";
import { PostForm } from "./post-form";

export const metadata: Metadata = { title: "신고하기" };

export default async function NewPostPage() {
  const mod = await getModule();
  return (
    <PageTransition>
      <div className="stagger">
        <Link
          href="/board"
          transitionTypes={["nav-back"]}
          style={stagger(0)}
          className="inline-block text-sm text-ink-muted transition-colors hover:text-ink"
        >
          ← 출동 요청
        </Link>
        <h1 style={stagger(1)} className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          신고하기
        </h1>
        <p style={stagger(2)} className="mt-3 max-w-prose text-ink-muted">
          여섯 칸을 채우면 출동하는 사람이 내 화면을 보지 않고도 상황을 알 수 있어요. 에러 문구는 고치지 말고 그대로
          붙여넣으세요.
        </p>
        <div style={stagger(3)}>
          <PostForm defaultModule={mod} />
        </div>
      </div>
    </PageTransition>
  );
}
