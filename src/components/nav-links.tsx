"use client";

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
    <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm whitespace-nowrap">
      {LINKS.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={active ? "border-b-2 border-action font-bold" : "text-ink-muted hover:text-ink"}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
