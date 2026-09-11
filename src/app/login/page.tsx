import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold">막힘 가이드</h1>
      <p className="mt-2 text-ink-muted">
        바이브 코딩으로 만들다 막혔을 때 보는 곳이에요. 강사에게 받은 수업 계정으로 들어오세요.
      </p>
      <LoginForm />
    </main>
  );
}
