import Link from "next/link";
import { getUser } from "@/lib/session";
import { logout } from "@/lib/actions";
import { NavLinks } from "@/components/nav-links";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/" className="font-bold">
            막힘 가이드
          </Link>
          <NavLinks />
          <div className="ml-auto flex items-center gap-3 text-sm text-ink-muted">
            <span>
              {user?.name}
              {user?.role === "instructor" && " (강사)"}
            </span>
            <form action={logout}>
              <button type="submit" className="underline hover:text-ink">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </>
  );
}
