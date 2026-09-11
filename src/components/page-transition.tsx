import { ViewTransition } from "react";

/** 페이지마다 감싼다. 링크에 transitionTypes 가 있으면 방향 있는 슬라이드, 없으면 위로 살짝 떠오르는 등장 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-in" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-out" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
