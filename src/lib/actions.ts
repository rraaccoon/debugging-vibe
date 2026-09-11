"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyPassword } from "@/lib/password";
import * as db from "@/lib/db";
import { createSession, deleteSession, requireUser } from "@/lib/session";

export type FormState = { error?: string } | undefined;

const field = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = field(formData, "name");
  const password = String(formData.get("password") ?? "");
  const user = name && password ? await db.findUserForLogin(name) : null;
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "이름이나 비밀번호가 맞지 않아요. 강사에게 받은 계정 그대로 입력해 주세요." };
  }
  await createSession(user.id);
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const fields: db.PostFields = {
    title: field(formData, "title"),
    whatDoing: field(formData, "what_doing"),
    whenHappened: field(formData, "when_happened"),
    howDid: field(formData, "how_did"),
    expected: field(formData, "expected"),
    actual: field(formData, "actual"),
  };
  if (Object.values(fields).some((v) => !v)) {
    return { error: "여섯 칸을 모두 채워 주세요. 답하는 사람이 상황을 그대로 볼 수 있어야 해요." };
  }
  const id = await db.createPost(user.id, fields);
  redirect(`/board/${id}`);
}

export async function addAnswer(formData: FormData): Promise<void> {
  const user = await requireUser();
  const postId = Number(formData.get("post_id"));
  const body = field(formData, "body");
  if (!Number.isInteger(postId) || !body) return;
  await db.addAnswer(postId, user.id, body);
  revalidatePath(`/board/${postId}`);
}
