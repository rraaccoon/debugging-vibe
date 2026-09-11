import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken, verifyToken } from "@/lib/token";
import { getUserById, type User } from "@/lib/db";

const COOKIE = "session";
const MAX_AGE = 30 * 24 * 60 * 60;

export async function createSession(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, signToken(userId, Date.now() + MAX_AGE * 1000), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** 쿠키 서명이 맞고 DB 에 있는 사람이면 그 사람, 아니면 null. 한 요청 안에서는 한 번만 조회한다 */
export const getUser = cache(async (): Promise<User | null> => {
  const id = verifyToken((await cookies()).get(COOKIE)?.value);
  return id === null ? null : getUserById(id);
});

export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}
