import { FireTruck, FlameShape } from "@/components/art";

/**
 * 화면 아래에 고정된 소방서 앞 거리. 글 뒤에 깔리는 장식이라 pointer-events 없고 aria-hidden.
 * 소방서 · 소화전 · 호스를 든 소방관은 서 있고, 소방차는 이따금 지나가며, 구름은 천천히 흐른다 (globals.css .fire-bg).
 * 움직임 줄이기 설정이면 소방차는 가운데에 세워 두고 구름은 멈춘다.
 */
export function FireBackground() {
  return (
    <div aria-hidden="true" className="fire-bg fire-anim pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-40 overflow-hidden sm:h-52">
      {/* 구름 */}
      <svg className="cloud cloud-a absolute top-2 w-40 text-white" viewBox="0 0 160 60">
        <circle cx="40" cy="36" r="20" fill="currentColor" />
        <circle cx="70" cy="26" r="26" fill="currentColor" />
        <circle cx="105" cy="34" r="22" fill="currentColor" />
        <rect x="30" y="34" width="100" height="22" rx="11" fill="currentColor" />
      </svg>
      <svg className="cloud cloud-b absolute top-10 w-28 text-white" viewBox="0 0 160 60">
        <circle cx="40" cy="36" r="20" fill="currentColor" />
        <circle cx="70" cy="26" r="26" fill="currentColor" />
        <circle cx="105" cy="34" r="22" fill="currentColor" />
        <rect x="30" y="34" width="100" height="22" rx="11" fill="currentColor" />
      </svg>

      {/* 소방서 */}
      <svg className="absolute bottom-2 left-[3%] w-44 sm:w-60" viewBox="0 0 240 160">
        <rect x="10" y="40" width="220" height="120" fill="var(--color-white)" stroke="var(--color-line)" strokeWidth="2" />
        <rect x="0" y="30" width="240" height="14" fill="var(--color-siren-soft)" />
        <rect x="0" y="30" width="240" height="4" fill="var(--color-siren)" />
        <rect x="222" y="6" width="3" height="26" fill="var(--color-ink-muted)" />
        <path d="M225 8 L246 13 L225 18 Z" fill="var(--color-siren)" />
        <rect x="85" y="52" width="70" height="26" rx="6" fill="var(--color-siren)" />
        <text x="120" y="71" textAnchor="middle" fontSize="19" fontWeight="900" fill="#fff" fontFamily="inherit">
          119
        </text>
        {[30, 160].map((x) => (
          <g key={x}>
            <rect x={x} y="92" width="70" height="68" rx="4" fill="var(--color-mist)" stroke="var(--color-line)" strokeWidth="2" />
            {[106, 120, 134, 148].map((y) => (
              <rect key={y} x={x + 4} y={y} width="62" height="2" fill="var(--color-line)" />
            ))}
            <circle cx={x + 35} cy="86" r="4" fill="var(--color-siren)" />
          </g>
        ))}
        {[110, 130].map((x) => (
          <rect key={x} x={x} y="98" width="18" height="24" rx="3" fill="var(--color-action-soft)" stroke="var(--color-line)" strokeWidth="2" />
        ))}
      </svg>

      {/* 소화전 · 소방관 · 꺼지는 불 */}
      <svg className="absolute bottom-2 right-[4%] w-40 sm:w-52" viewBox="0 0 220 124">
        <FlameShape x={26} y={112} scale={0.55} />
        <path d="M118 62 C 96 30, 56 40, 30 76" fill="none" stroke="var(--color-action)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 8" className="hose" />
        {/* 소화전 */}
        <rect x="64" y="60" width="22" height="46" rx="6" fill="var(--color-siren)" />
        <rect x="60" y="52" width="30" height="10" rx="4" fill="var(--color-siren-deep)" />
        <circle cx="75" cy="50" r="7" fill="var(--color-siren)" />
        <rect x="52" y="74" width="12" height="9" rx="3" fill="var(--color-siren-deep)" />
        <rect x="86" y="74" width="12" height="9" rx="3" fill="var(--color-siren-deep)" />
        <rect x="66" y="88" width="18" height="4" fill="var(--color-mark)" />
        <rect x="58" y="104" width="34" height="8" rx="3" fill="var(--color-ink-muted)" />
        {/* 소방관 */}
        <ellipse cx="150" cy="30" rx="19" ry="7" fill="var(--color-siren)" />
        <path d="M136 30 a14 14 0 0 1 28 0 z" fill="var(--color-siren)" />
        <rect x="146" y="20" width="8" height="5" rx="2" fill="var(--color-mark)" />
        <circle cx="150" cy="40" r="9" fill="var(--color-white)" stroke="var(--color-line)" strokeWidth="2" />
        <rect x="132" y="50" width="36" height="42" rx="8" fill="var(--color-ink)" />
        <rect x="132" y="62" width="36" height="4" fill="var(--color-mark)" />
        <rect x="132" y="76" width="36" height="4" fill="var(--color-mark)" />
        <rect x="116" y="58" width="22" height="9" rx="4" fill="var(--color-ink)" />
        <rect x="110" y="56" width="10" height="12" rx="2" fill="var(--color-ink-muted)" />
        <rect x="135" y="90" width="12" height="18" fill="var(--color-ink-muted)" />
        <rect x="153" y="90" width="12" height="18" fill="var(--color-ink-muted)" />
        <rect x="132" y="106" width="16" height="6" rx="2" fill="var(--color-ink)" />
        <rect x="152" y="106" width="16" height="6" rx="2" fill="var(--color-ink)" />
      </svg>

      {/* 달리는 소방차 */}
      <FireTruck className="truck absolute bottom-1.5 left-0 w-36 sm:w-44" />

      {/* 거리 */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-line" />
    </div>
  );
}
