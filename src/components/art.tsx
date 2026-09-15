/**
 * 소방 컨셉 그림. 전부 장식이라 aria-hidden. 색은 테마 토큰(CSS 변수)을 그대로 쓴다.
 * .fire-anim 안에서만 불꽃 · 물줄기 · 경광등이 움직인다(globals.css). 움직임 줄이기 설정이면 멈춤.
 */

/** 왼쪽을 보는 소방차 도형 — 장면 좌표(x 96~300 · y 22~113)에 그려지는 <g>. 홈 장면과 배경이 같이 쓴다 */
export function TruckShape() {
  return (
    <g>
      <defs>
        <pattern id="truck-chevron" width="12" height="8" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)">
          <rect width="6" height="8" fill="var(--color-siren-deep)" />
        </pattern>
      </defs>
      <rect x="150" y="44" width="150" height="52" rx="10" fill="var(--color-siren)" />
      <rect x="104" y="34" width="60" height="62" rx="10" fill="var(--color-siren)" />
      <rect x="112" y="44" width="30" height="22" rx="5" fill="var(--color-action-soft)" />
      <rect x="160" y="33" width="122" height="7" rx="2" fill="var(--color-mark-deep)" />
      {[178, 202, 226, 250, 274].map((x) => (
        <rect key={x} x={x} y="33" width="4" height="7" fill="var(--color-siren-deep)" />
      ))}
      <rect x="104" y="76" width="196" height="8" fill="var(--color-mark)" />
      <rect x="104" y="76" width="196" height="8" fill="url(#truck-chevron)" opacity="0.9" />
      <rect x="120" y="22" width="20" height="9" rx="3" fill="var(--color-action)" className="beacon" />
      <rect x="98" y="26" width="14" height="9" rx="2" fill="var(--color-ink)" />
      <rect x="96" y="60" width="10" height="16" rx="2" fill="var(--color-ink)" />
      <circle cx="136" cy="98" r="15" fill="var(--color-ink)" />
      <circle cx="136" cy="98" r="6" fill="var(--color-line)" />
      <circle cx="262" cy="98" r="15" fill="var(--color-ink)" />
      <circle cx="262" cy="98" r="6" fill="var(--color-line)" />
    </g>
  );
}

/**
 * 불꽃 도형 — 밑변 가운데가 (x, y). 바깥 g 가 자리와 크기를 잡고, 안쪽 g 가 자기 밑변(36,112)을 축으로 일렁인다.
 * (한 g 에 transform 과 transform-origin 을 같이 두면 origin 이 transform 에도 걸려 그림이 밀려난다)
 */
export function FlameShape({ x = 36, y = 112, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x - 36 * scale} ${y - 112 * scale}) scale(${scale})`}>
      <g className="flame" style={{ transformOrigin: "36px 112px" }}>
      <path
        d="M36 112c-14 0-23-9-23-21 0-9 6-14 8-23 4 6 6 8 8 8 0-9 3-17 10-25 1 10 8 15 12 22 2 4 4 8 4 13 0 14-8 26-19 26z"
        fill="var(--color-siren)"
      />
      <path
        d="M36 112c-7 0-12-5-12-12 0-6 4-9 6-14 2 4 4 6 6 6 0-5 2-9 5-13 1 6 5 9 7 13 1 2 2 5 2 8 0 8-5 12-14 12z"
        fill="var(--color-flame)"
      />
      <path
        d="M36 112c-4 0-6-3-6-6 0-3 2-5 3-8 1 2 2 3 3 3 0-3 1-5 3-7 0 3 3 5 4 7 0 1 1 3 1 4 0 4-3 7-8 7z"
        fill="var(--color-mark)"
      />
      </g>
    </g>
  );
}

/** 홈 첫 화면: 소방차가 왼쪽 아래 불에 물을 뿌린다 */
export function FireScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 124" className={className} aria-hidden="true" focusable="false">
      <FlameShape />
      <path
        d="M106 26 C 84 -6, 48 16, 38 66"
        fill="none"
        stroke="var(--color-action)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="7 9"
        className="hose"
      />
      <TruckShape />
      <rect x="0" y="112" width="320" height="3" rx="1.5" fill="var(--color-line)" />
    </svg>
  );
}

/** 소방차만 (배경에 서 있다) */
export function FireTruck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="94 20 208 94" className={className} aria-hidden="true" focusable="false">
      <TruckShape />
    </svg>
  );
}

/** 카드 · 배지에 붙는 작은 불꽃 */
export function FlameIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M12 22c-4.4 0-8-3.2-8-7.6 0-3.3 2.2-5.1 3-8 1.3 2.1 2.2 2.8 3 2.8 0-3.3 1-6.2 3.5-9.2.4 3.6 3 5.4 4.4 7.9.7 1.3 1.1 2.7 1.1 4.2C19 18.8 16.4 22 12 22z"
        fill="var(--color-siren)"
      />
      <path
        d="M12 22c-2.4 0-4.3-1.8-4.3-4.2 0-2 1.4-3.2 2-5 .7 1.4 1.4 2.1 2 2.1 0-1.8.7-3.3 1.8-4.6.3 2.2 1.8 3.3 2.6 4.7.4.8.6 1.6.6 2.6 0 2.7-2.2 4.4-4.7 4.4z"
        fill="var(--color-flame)"
      />
    </svg>
  );
}
