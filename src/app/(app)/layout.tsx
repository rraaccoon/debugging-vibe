import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { getModule } from "@/lib/module";
import { logout } from "@/lib/actions";
import { NavLinks } from "@/components/nav-links";
import { ModuleTabs } from "@/components/module-tabs";
import { BrandMark } from "@/components/brand-mark";
import { Wordmark } from "@/components/wordmark";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, mod] = await Promise.all([getUser(), getModule()]);
  if (!user) redirect("/login");
  if (user.role === "shared") redirect("/setup");
  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className="top-0 z-10 border-b border-line/80 bg-paper/85 backdrop-blur sm:sticky"
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2.5">
          <Link
            href="/"
            className="group flex items-center gap-2 py-1 font-display text-lg transition-transform duration-300 ease-spring hover:-rotate-2"
          >
            <BrandMark />
            <span>
              <Wordmark />
            </span>
          </Link>
          <NavLinks />
          <div className="ml-auto flex items-center gap-1 text-sm text-ink-muted">
            <span className="px-1">
              {user?.name}
              {user?.role === "instructor" && " (강사)"}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 transition-colors duration-200 hover:bg-mist hover:text-ink"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
        <ModuleTabs current={mod} />
        <div aria-hidden="true" className="siren-stripe h-1" />
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 pb-48 sm:pb-60">{children}</main>
    </>
  );
}
