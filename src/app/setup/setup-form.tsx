"use client";

import { useActionState } from "react";
import { setupAccount } from "@/lib/actions";
import { BUTTON, INPUT } from "@/components/ui";

export function SetupForm() {
  const [state, action, pending] = useActionState(setupAccount, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-bold">
        닉네임
        <span className="font-normal text-ink-muted">로그인할 때 쓰고, 게시판에 이 이름으로 보여요</span>
        <input name="nickname" required minLength={2} maxLength={20} autoComplete="username" className={INPUT} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        이름
        <span className="font-normal text-ink-muted">실제 이름. 강사만 볼 수 있어요</span>
        <input name="real_name" required maxLength={30} autoComplete="name" className={INPUT} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        새 비밀번호
        <span className="font-normal text-ink-muted">6자 이상</span>
        <input type="password" name="password" required minLength={6} autoComplete="new-password" className={INPUT} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        새 비밀번호 확인
        <input type="password" name="confirm" required minLength={6} autoComplete="new-password" className={INPUT} />
      </label>
      {state?.error && (
        <p key={state.error} role="alert" className="animate-shake rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${BUTTON} mt-1`}>
        {pending ? "만드는 중" : "계정 만들기"}
      </button>
    </form>
  );
}
