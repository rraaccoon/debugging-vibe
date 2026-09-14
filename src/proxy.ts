import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/token.ts";

/**
 * 쿠키 서명만 본다(DB 조회 없음). 진짜 확인은 각 페이지·액션의 getUser/requireUser 가 한다.
 * /login 은 항상 열어 둔다 — 서명은 맞지만 DB 에 없는 계정(지워진 계정)이 무한 리다이렉트에 빠지지 않게.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/login") return NextResponse.next();
  const loggedIn = verifyToken(request.cookies.get("session")?.value) !== null;
  return loggedIn ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image).*)"],
};
