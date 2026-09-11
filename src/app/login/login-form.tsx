"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";
import { BUTTON, INPUT } from "@/components/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-bold">
        이름
        <input name="name" required autoComplete="username" className={INPUT} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        비밀번호
        <input type="password" name="password" required autoComplete="current-password" className={INPUT} />
      </label>
      {state?.error && (
        <p key={state.error} role="alert" className="animate-shake rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${BUTTON} mt-1`}>
        {pending ? "확인하는 중" : "로그인"}
      </button>
    </form>
  );
}
