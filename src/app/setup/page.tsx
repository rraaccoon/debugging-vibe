import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { logout } from "@/lib/actions";
import { SetupForm } from "./setup-form";

export const metadata: Metadata = { title: "내 계정 만들기" };

export default async function SetupPage() {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.role !== "shared") redirect("/");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold">내 계정 만들기</h1>
      <p className="mt-2 text-ink-muted">
        처음 오셨네요. 다음부터는 여기서 정한 닉네임과 비밀번호로 들어오세요. 이름은 강사만 볼 수 있어요.
      </p>
      <SetupForm />
      <form action={logout} className="mt-6 text-sm text-ink-muted">
        <button type="submit" className="underline hover:text-ink">
          나중에 할게요 (로그아웃)
        </button>
      </form>
    </main>
  );
}
