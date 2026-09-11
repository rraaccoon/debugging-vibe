/**
 * storage.ts 의 한도 · 규칙 검사. 프레임워크 없음.
 *   실행: node src/lib/storage.test.ts   (Node 22.18+ · 24 — .ts 를 그대로 읽는다)
 *
 * DB 전환(06 저장 항목 → Neon Postgres) 이후 getSchedules · saveSchedule · getSchedule ·
 * getAttendances · saveAttendance · getMembers · setMembers · getShareLink · saveShareLink 는
 * src/lib/db.ts 의 "use server" 서버 액션으로 옮겨졌다 — 실제 Postgres 접속이 있어야 돌릴 수
 * 있고, 이 스크립트는 plain node 로 돌아 그런 접속을 새로 만들지 않는다(공유 DB 에 테스트
 * 데이터를 남기고 싶지 않다는 이유도 있다). 그 함수들의 SQL 은 db.ts 를 보고 확인한다 —
 * 실제 접속 확인은 `npm run dev` 로 화면에서 일정 등록 · 참석 남기기 · 새로고침으로 한다.
 *
 * 여기서는 순수 계산 함수(todayString · validateSchedule · validateAttendance)만 검사한다 —
 * DB 유무와 상관없이 그대로 남아 있어야 하는 규칙들이다.
 */
import assert from "node:assert/strict";
import { todayString, validateAttendance, validateSchedule } from "./storage.ts";

const 오늘 = todayString();
const 어제 = todayString(new Date(Date.now() - 24 * 60 * 60 * 1000));
const 내일 = todayString(new Date(Date.now() + 24 * 60 * 60 * 1000));

const 일정 = {
  title: "9월 정기 모임",
  date: 내일,
  time: "19:00",
  place: "스터디룸 B",
  status: "예정" as const,
  changed: false,
  createdAt: new Date().toISOString(),
};

function throwsValidation(reason: string | null, message: string) {
  assert.equal(reason, message);
}

// P3 — 제목 · 날짜 · 시간 · 장소는 비울 수 없다
for (const 빈칸 of [{ title: "" }, { date: "" }, { time: "" }, { place: " " }]) {
  throwsValidation(
    validateSchedule({ ...일정, ...빈칸 }),
    "제목 · 날짜 · 시간 · 장소는 비울 수 없습니다",
  );
}

// P3 — 제목은 30자까지
throwsValidation(validateSchedule({ ...일정, title: "가".repeat(31) }), "제목은 30자까지입니다");
assert.equal(validateSchedule({ ...일정, title: "가".repeat(30) }), null, "30자는 된다");

// 날짜 · 시간 형식
throwsValidation(validateSchedule({ ...일정, date: "2026/09/12" }), "날짜 형식이 올바르지 않습니다");
throwsValidation(validateSchedule({ ...일정, time: "7:00" }), "시간 형식이 올바르지 않습니다");

// P3 — 날짜는 오늘 이후만 ("지난 날짜입니다")
throwsValidation(validateSchedule({ ...일정, date: 어제 }), "지난 날짜입니다");
assert.equal(validateSchedule({ ...일정, date: 오늘 }), null, "오늘은 된다");
assert.equal(validateSchedule({ ...일정, date: 내일 }), null);

// 상태값은 셋 중 하나
throwsValidation(
  validateSchedule({ ...일정, status: "취소됨" as never }),
  "상태값이 올바르지 않습니다",
);

// P5 — 참석/불참 둘 중 하나 · 이름 · 어느 일정은 비울 수 없다
const 응답 = {
  name: "민수",
  schedule: "9월 정기 모임",
  answer: "참석" as const,
  answeredAt: new Date().toISOString(),
};
assert.equal(validateAttendance(응답), null);
throwsValidation(
  validateAttendance({ ...응답, answer: "미정" as never }),
  "참석 · 불참 중 하나여야 합니다",
);
throwsValidation(validateAttendance({ ...응답, name: "  " }), "이름을 입력하세요");
throwsValidation(validateAttendance({ ...응답, schedule: " " }), "어느 일정인지 없습니다");

console.log("순수 검증 함수 통과 (DB 함수는 db.ts 참조 — 실제 접속 확인은 npm run dev)");
