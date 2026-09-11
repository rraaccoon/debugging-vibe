import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { BrandMark } from "@/components/brand-mark";
import { stagger } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect(user.role === "shared" ? "/setup" : "/");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-12">
      <div className="stagger">
        <div style={stagger(0)}>
          <BrandMark size="lg" ripple />
        </div>
        <h1 style={stagger(1)} className="mt-6 font-display text-4xl leading-tight">
          디버그 119
        </h1>
        <p style={stagger(2)} className="mt-2 text-ink-muted">
          바이브 코딩하다 <span className="marker">막히면 여기로</span>. 강사에게 받은 수업 계정으로 들어오세요.
        </p>
        <div style={stagger(3)} className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-clay">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
