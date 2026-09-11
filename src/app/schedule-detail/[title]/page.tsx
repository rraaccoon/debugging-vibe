"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Screen, ScreenHeader } from "@/components/screen";
import { Badge, NameChip, TextInput, OutlineButton } from "@/components/ui";
import { getSchedule, getAttendances, saveAttendance, getMembers } from "@/lib/db";
import { getIsAdmin } from "@/lib/storage";
import type { Attendance, Schedule } from "@/lib/storage";

interface PageProps {
  params: Promise<{ title: string }>;
}

export default function ScheduleDetailPage({ params }: PageProps) {
  const { title } = use(params);
  const router = useRouter();
  const decodedTitle = decodeURIComponent(title);

  // 참석 여부 입력 상태 (P2) - 항상 초기화
  const [name, setName] = useState("");
  const [submitError, setSubmitError] = useState<string>("");

  // 일정 · 참석 응답 · 미응답 명단 로드 상태
  const [schedule, setSchedule] = useState<Schedule | undefined>(undefined);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [pendingList, setPendingList] = useState<string[]>([]);

  // 총무 판정 (P1 · P4) — 로그인 전 임시 스위치, localStorage 라 동기로 그대로 둔다
  const isAdmin = getIsAdmin();

  // 일정 · 참석 응답 · 미응답 명단을 함께 읽어 온다(값만 반환 — setState 는 호출부가 한다)
  const fetchDetail = useCallback(async () => {
    const found = await getSchedule(decodedTitle);
    const atts = found ? await getAttendances(decodedTitle) : [];

    // 미응답 명단 계산 (F4 · P1 — 총무만)
    // [?] 미응답 명단이 총무만 보는지 명시적으로 묻지는 않았으나, F4 "총무가 일정을 열면"으로 해석
    let pending: string[] = [];
    if (isAdmin && found) {
      const memberList = await getMembers();
      const respondedNames = new Set(atts.map((a) => a.name));
      pending = memberList.filter((m) => !respondedNames.has(m.name)).map((m) => m.name);
    }

    return { found, atts, pending };
  }, [decodedTitle, isAdmin]);

  useEffect(() => {
    let cancelled = false;
    fetchDetail().then(({ found, atts, pending }) => {
      if (cancelled) return;
      setSchedule(found);
      setAttendances(atts);
      setPendingList(pending);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchDetail]);

  // 상태값 판정
  const isUpcoming = schedule?.status === "예정";
  const isStarted = schedule && schedule.status !== "예정";

  const canEdit = isAdmin && isUpcoming;

  // 참석 응답 데이터 (F4)
  const attendList = attendances
    .filter((a) => a.answer === "참석")
    .map((a) => a.name);
  const absentList = attendances
    .filter((a) => a.answer === "불참")
    .map((a) => a.name);

  // 참석/불참 저장 (F3 · P5)
  const handleAttendance = async (answer: "참석" | "불참") => {
    if (!name.trim()) {
      setSubmitError("이름을 입력하세요");
      return;
    }

    const attendance: Attendance = {
      name: name.trim(),
      schedule: decodedTitle,
      answer,
      answeredAt: new Date().toISOString(),
    };

    try {
      await saveAttendance(attendance);
      setName("");
      setSubmitError("");
      // 명단 다시 불러와 반영
      const { found, atts, pending } = await fetchDetail();
      setSchedule(found);
      setAttendances(atts);
      setPendingList(pending);
    } catch (error) {
      setSubmitError((error as Error).message || "저장 실패");
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateStr: string): string => {
    const date = new Date(`${dateStr}T00:00`);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${month}월 ${day}일(${dayOfWeek})`;
  };

  if (!schedule) {
    return (
      <Screen>
        <ScreenHeader title="일정 상세" onBack={() => router.back()} />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-base text-text-muted">일정을 찾을 수 없습니다</p>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title="일정 상세"
        onBack={() => router.back()}
        action={
          canEdit && (
            <Link href={`/schedule-form?title=${encodeURIComponent(decodedTitle)}`}>
              <button
                type="button"
                className="min-h-[var(--tap-min)] px-2 text-md font-bold text-primary hover:text-primary-strong"
              >
                수정
              </button>
            </Link>
          )
        }
      />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-2 px-5 pb-6">
        {/* 일정 정보 섹션 */}
        <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h2 className="text-lg font-bold leading-tight">{schedule.title}</h2>
            {isUpcoming && <Badge tone="primary">예정</Badge>}
            {isStarted && <Badge tone="neutral">{schedule.status}</Badge>}
          </div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="16" rx="3"></rect>
                <path d="M8 3v4M16 3v4M3 10h18"></path>
              </svg>
              {formatDate(schedule.date)} · {schedule.time}
            </span>
            <span className="flex items-center gap-2 text-sm text-text-muted">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z"></path>
                <circle cx="12" cy="9.5" r="2.3"></circle>
              </svg>
              {schedule.place}
            </span>
            {schedule.changed && (
              <span className="mt-2 text-xs text-primary font-bold">변경됨</span>
            )}
          </div>
        </section>

        {/* 참석 여부 남기기 섹션 (F3 · P2) */}
        <section className="flex flex-col gap-2">
          <h3 className="text-md font-bold">참석 여부 남기기</h3>
          {isUpcoming ? (
            <>
              <TextInput
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (submitError) setSubmitError("");
                }}
              />
              <div className="flex gap-3">
                <OutlineButton onClick={() => handleAttendance("참석")}>
                  참석
                </OutlineButton>
                <OutlineButton onClick={() => handleAttendance("불참")}>
                  불참
                </OutlineButton>
              </div>
              {submitError && (
                <p className="text-xs text-danger">{submitError}</p>
              )}
            </>
          ) : (
            <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-text-muted">
              이미 시작된 일정입니다
            </p>
          )}
        </section>

        {/* 명단 섹션 (F4) */}
        <section className="flex flex-col gap-3">
          {/* 참석 명단 */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="mb-2 text-sm font-bold text-text-muted">
              참석 {attendList.length}명
            </h3>
            <div className="flex flex-wrap gap-2">
              {attendList.length > 0 ? (
                attendList.map((attendeeName) => (
                  <NameChip key={attendeeName}>{attendeeName}</NameChip>
                ))
              ) : (
                <p className="text-sm text-text-faint">아직 없습니다</p>
              )}
            </div>
          </div>

          {/* 불참 명단 */}
          <div className="rounded-lg border border-border bg-surface p-4">
            <h3 className="mb-2 text-sm font-bold text-text-muted">
              불참 {absentList.length}명
            </h3>
            <div className="flex flex-wrap gap-2">
              {absentList.length > 0 ? (
                absentList.map((absenteeName) => (
                  <NameChip key={absenteeName}>{absenteeName}</NameChip>
                ))
              ) : (
                <p className="text-sm text-text-faint">아직 없습니다</p>
              )}
            </div>
          </div>

          {/* 미응답 명단 (총무만) */}
          {isAdmin && (
            <div className="rounded-lg border border-border bg-surface p-4">
              <h3 className="mb-2 text-sm font-bold text-text-muted">
                미응답 {pendingList.length}명
              </h3>
              <div className="flex flex-wrap gap-2">
                {pendingList.length > 0 ? (
                  pendingList.map((pendingName) => (
                    <NameChip key={pendingName}>{pendingName}</NameChip>
                  ))
                ) : (
                  <p className="text-sm text-text-faint">없음</p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </Screen>
  );
}
