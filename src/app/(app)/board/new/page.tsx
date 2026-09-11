import type { Metadata } from "next";
import { PostForm } from "./post-form";

export const metadata: Metadata = { title: "질문 올리기" };

export default function NewPostPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">질문 올리기</h1>
      <p className="mt-2 max-w-prose text-ink-muted">
        여섯 칸을 채우면 답하는 사람이 내 화면을 보지 않고도 상황을 알 수 있어요. 에러 문구는 고치지 말고 그대로
        붙여넣으세요.
      </p>
      <PostForm />
    </>
  );
}
