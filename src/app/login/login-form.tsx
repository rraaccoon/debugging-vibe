"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";
import { BUTTON, INPUT } from "@/components/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-bold">
        이름
        <input name="name" required autoComplete="username" className={INPUT} />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        비밀번호
        <input type="password" name="password" required autoComplete="current-password" className={INPUT} />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-sm bg-danger-soft px-3 py-2 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={BUTTON}>
        {pending ? "확인하는 중" : "로그인"}
      </button>
    </form>
  );
}
