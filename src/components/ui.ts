import type { CSSProperties } from "react";

export const INPUT =
  "w-full rounded-xl border-2 border-line bg-white px-3.5 py-2.5 text-base font-normal placeholder:text-ink-faint transition-[border-color,box-shadow] duration-200 focus:border-action focus:outline-none focus:ring-4 focus:ring-action/15";

export const BUTTON =
  "inline-flex items-center justify-center gap-1.5 rounded-full bg-action px-5 py-2.5 text-sm font-bold text-white shadow-clay-sm transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:bg-action-deep hover:shadow-clay active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

export const CHIP =
  "rounded-full border border-line bg-white px-3.5 py-1.5 text-sm shadow-clay-sm transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:text-action hover:shadow-clay active:translate-y-0 active:scale-95";

/** .stagger 자식의 등장 순서 */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;
