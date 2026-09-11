"use client";

import { ViewTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "증상별 가이드" },
  { href: "/checklist", label: "체크리스트" },
  { href: "/board", label: "질문 게시판" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-x-1 text-sm whitespace-nowrap">
      {LINKS.map((l) => {
        const active =
          l.href === "/" ? pathname === "/" || pathname.startsWith("/guide") : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-md px-2 py-2 transition-colors duration-200 hover:text-ink ${active ? "font-bold" : "text-ink-muted"}`}
          >
            {l.label}
            {active && (
              <ViewTransition name="nav-active">
                <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-action" />
              </ViewTransition>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
