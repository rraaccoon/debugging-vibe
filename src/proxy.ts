import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/token.ts";

/** 쿠키 서명만 본다(DB 조회 없음). 진짜 확인은 각 페이지·액션의 requireUser 가 한다 */
export function proxy(request: NextRequest) {
  const loggedIn = verifyToken(request.cookies.get("session")?.value) !== null;
  const isLogin = request.nextUrl.pathname === "/login";

  if (isLogin && loggedIn) return NextResponse.redirect(new URL("/", request.url));
  if (!isLogin && !loggedIn) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
