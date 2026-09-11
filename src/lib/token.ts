import { createHmac, timingSafeEqual } from "node:crypto";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET 환경변수가 없습니다 (.env.local 과 Vercel 에 넣으세요)");
  return s;
}

function hmac(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("hex");
}

export function signToken(userId: number, expiresAt: number): string {
  const body = `${userId}.${expiresAt}`;
  return `${body}.${hmac(body)}`;
}

/** 서명이 맞고 만료 전이면 userId, 아니면 null */
export function verifyToken(token: string | undefined, now = Date.now()): number | null {
  if (!token) return null;
  const [id, exp, sig] = token.split(".");
  if (!id || !exp || !sig) return null;
  const expected = hmac(`${id}.${exp}`);
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Number(exp) < now) return null;
  const userId = Number(id);
  return Number.isInteger(userId) ? userId : null;
}
