import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { CATEGORIES, GUIDES } from "@/content/guides";
import { GuideItem } from "@/components/guide-item";
import { PageTransition } from "@/components/page-transition";
import { CHIP, stagger } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

const find = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: find(slug)?.title ?? "가이드" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = find(slug);
  if (!category) notFound();
  const items = GUIDES.filter((g) => g.category === category.title);
  const others = CATEGORIES.filter((c) => c.slug !== slug);

  return (
    <PageTransition>
      <div className="stagger">
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          style={stagger(0)}
          className="inline-block text-sm text-ink-muted transition-colors hover:text-ink"
        >
          ← 유형 고르기
        </Link>
        <ViewTransition name={`cat-${slug}`} share="morph" default="none">
          <h1 style={stagger(1)} className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            {category.title}
          </h1>
        </ViewTransition>
        <p style={stagger(2)} className="mt-3 max-w-prose text-ink-muted">
          {category.blurb}. 증상을 열면 원인, 먼저 확인할 것, 그리고 AI 도구에 붙여넣을 말이 있어요. [대괄호]는 내
          상황으로 바꿔서 붙이세요.
        </p>
        <div style={stagger(3)} className="mt-6 divide-y divide-line">
          {items.map((g) => (
            <GuideItem key={g.id} guide={g} />
          ))}
        </div>
        <nav style={stagger(4)} className="mt-12 border-t border-line pt-6">
          <p className="text-sm font-bold text-ink-muted">다른 유형</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link key={c.slug} href={`/guide/${c.slug}`} className={CHIP}>
                {c.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </PageTransition>
  );
}
