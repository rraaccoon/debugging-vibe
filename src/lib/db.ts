"use server";

/**
 * 06-data.md 저장 항목 4개(일정 · 참석 응답 · 구성원 명단 · 공유 주소)를 Neon Postgres 에
 * 읽고 쓴다. "use server" 파일이라 Next.js 가 이 모듈을 서버에만 두고, 클라이언트 컴포넌트는
 * 여기서 내보낸 함수를 서버 액션으로 호출한다(브라우저로 DB 코드 · 연결 문자열이 나가지 않는다).
 *
 * 함수 이름 · 검증 규칙은 이전 localStorage 버전(storage.ts)과 그대로다 — 저장소만 바뀌었다.
 * 표에 없는 칸 · 테이블은 만들지 않는다(06-data.md 그대로).
 */

import { neon } from "@neondatabase/serverless";
import { assertValid, validateAttendance, validateSchedule } from "./storage.ts";
import type { Attendance, Member, Schedule, ShareLink } from "./storage.ts";

const sql = neon(process.env.DATABASE_URL!);

/* ── 스키마 준비 — 처음 쓸 때 한 번만(프로세스마다) ── */

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) schemaReady = createTables();
  return schemaReady;
}

async function createTables(): Promise<void> {
  // 06-data.md 의 칸만 — 항목 사이 관계(FK)는 긋지 않는다(문서 지시)
  await sql`
    CREATE TABLE IF NOT EXISTS schedules (
      title TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      place TEXT NOT NULL,
      status TEXT NOT NULL,
      changed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS attendances (
      name TEXT NOT NULL,
      schedule TEXT NOT NULL,
      answer TEXT NOT NULL,
      answered_at TEXT NOT NULL,
      PRIMARY KEY (name, schedule)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS share_links (
      schedule TEXT PRIMARY KEY,
      url TEXT NOT NULL
    )
  `;
}

/* ── 일정 ── */

export async function getSchedules(): Promise<Schedule[]> {
  await ensureSchema();
  const rows = await sql`
    SELECT title, date, time, place, status, changed, created_at AS "createdAt"
    FROM schedules
  `;
  return rows as Schedule[];
}

/** 같은 제목이면 덮어쓴다(F5 수정) · 없으면 새로 넣는다(F1 등록) */
export async function saveSchedule(schedule: Schedule, now: Date = new Date()): Promise<void> {
  assertValid(validateSchedule(schedule, now));
  await ensureSchema();
  await sql`
    INSERT INTO schedules (title, date, time, place, status, changed, created_at)
    VALUES (${schedule.title}, ${schedule.date}, ${schedule.time}, ${schedule.place},
      ${schedule.status}, ${schedule.changed}, ${schedule.createdAt})
    ON CONFLICT (title) DO UPDATE SET
      date = EXCLUDED.date,
      time = EXCLUDED.time,
      place = EXCLUDED.place,
      status = EXCLUDED.status,
      changed = EXCLUDED.changed,
      created_at = EXCLUDED.created_at
  `;
}

export async function getSchedule(title: string): Promise<Schedule | undefined> {
  await ensureSchema();
  const rows = await sql`
    SELECT title, date, time, place, status, changed, created_at AS "createdAt"
    FROM schedules WHERE title = ${title}
  `;
  return rows[0] as Schedule | undefined;
}

/* ── 참석 응답 ── */

export async function getAttendances(scheduleTitle?: string): Promise<Attendance[]> {
  await ensureSchema();
  const rows =
    scheduleTitle === undefined
      ? await sql`SELECT name, schedule, answer, answered_at AS "answeredAt" FROM attendances`
      : await sql`
          SELECT name, schedule, answer, answered_at AS "answeredAt"
          FROM attendances WHERE schedule = ${scheduleTitle}
        `;
  return rows as Attendance[];
}

/** P5 — 한 사람은 일정 하나에 답 하나만. 같은 이름으로 다시 누르면 덮어쓴다 */
export async function saveAttendance(attendance: Attendance): Promise<void> {
  assertValid(validateAttendance(attendance));
  await ensureSchema();
  await sql`
    INSERT INTO attendances (name, schedule, answer, answered_at)
    VALUES (${attendance.name}, ${attendance.schedule}, ${attendance.answer}, ${attendance.answeredAt})
    ON CONFLICT (name, schedule) DO UPDATE SET
      answer = EXCLUDED.answer,
      answered_at = EXCLUDED.answered_at
  `;
}

/* ── 구성원 명단 ── */
/* [?] 명단을 누가 · 어디서 만드나 — 06 에서 정하지 않았다. 여기서는 읽고 쓰기만 둔다 */

export async function getMembers(): Promise<Member[]> {
  await ensureSchema();
  const rows = await sql`SELECT name FROM members ORDER BY id`;
  return rows as Member[];
}

/** 명단 전체를 통째로 바꿔 끼운다(원래 localStorage 버전과 같은 동작) */
export async function setMembers(members: Member[]): Promise<void> {
  for (const member of members) {
    if (!member.name.trim()) throw new Error("이름을 입력하세요");
  }
  await ensureSchema();
  // ponytail: 삭제 후 순차 삽입 — 명단이 12명 안팎이라 트랜잭션 없이도 충분하다.
  // 동시에 두 총무가 같이 편집하는 규모가 되면 sql.transaction() 으로 묶는다.
  await sql`DELETE FROM members`;
  for (const member of members) {
    await sql`INSERT INTO members (name) VALUES (${member.name})`;
  }
}

/* ── 공유 주소 ── */

export async function getShareLink(scheduleTitle: string): Promise<ShareLink | undefined> {
  await ensureSchema();
  const rows = await sql`SELECT schedule, url FROM share_links WHERE schedule = ${scheduleTitle}`;
  return rows[0] as ShareLink | undefined;
}

/** 한 일정에 주소 하나 — 새로고침 뒤에도 같아야 한다(06 근거) */
export async function saveShareLink(link: ShareLink): Promise<void> {
  if (!link.schedule.trim() || !link.url.trim()) throw new Error("어느 일정 · 주소가 비었습니다");
  await ensureSchema();
  await sql`
    INSERT INTO share_links (schedule, url) VALUES (${link.schedule}, ${link.url})
    ON CONFLICT (schedule) DO UPDATE SET url = EXCLUDED.url
  `;
}
