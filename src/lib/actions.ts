"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword } from "@/lib/password";
import * as db from "@/lib/db";
import { createSession, deleteSession, getUser, requireUser } from "@/lib/session";

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
  redirect(user.role === "shared" ? "/setup" : "/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

/** 공용 계정으로 들어온 학생이 자기 계정(닉네임 · 이름 · 비밀번호)을 만든다 */
export async function setupAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.role !== "shared") redirect("/");

  const nickname = field(formData, "nickname");
  const realName = field(formData, "real_name");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!/^[\p{L}\p{N}_-]{2,20}$/u.test(nickname)) {
    return { error: "닉네임은 2~20자, 한글 · 영문 · 숫자 · _ · - 만 쓸 수 있어요." };
  }
  if (!realName) return { error: "이름을 적어 주세요. 강사만 볼 수 있어요." };
  if (password.length < 6) return { error: "비밀번호는 6자 이상으로 해 주세요." };
  if (password !== confirm) return { error: "비밀번호 두 칸이 서로 달라요." };
  if (await db.findUserForLogin(nickname)) return { error: "이미 쓰는 닉네임이에요. 다른 닉네임을 골라 주세요." };

  const id = await db.createStudent(nickname, hashPassword(password), realName);
  await createSession(id);
  redirect("/");
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
