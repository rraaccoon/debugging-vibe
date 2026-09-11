"use client";

import { useState } from "react";
import Link from "next/link";
import { Screen, ScreenHeader } from "@/components/screen";
import { ScheduleCard } from "@/components/schedule-card";
import { getSchedules, getAttendances, getIsAdmin, setIsAdmin } from "@/lib/storage";
import { IconButton } from "@/components/ui";
import { PlusIcon } from "@/components/icons";

export default function ScheduleListPage() {
  const [schedules] = useState(() => {
    // 저장된 모든 일정 읽기
    const allSchedules = getSchedules();

    // F2: 다가오는 일정만 표시 (상태값이 "예정" 또는 "진행 중"인 것)
    return allSchedules
      .filter((s) => s.status === "예정" || s.status === "진행 중")
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  // P1: 총무 판정 — 로그인(모듈2) 전이라 화면의 전환 스위치로 대신한다
  const [isAdmin, setIsAdminState] = useState(getIsAdmin);
  const toggleAdmin = () => {
    const next = !isAdmin;
    setIsAdmin(next);
    setIsAdminState(next);
  };

  const isEmpty = schedules.length === 0;

  return (
    <Screen>
      <ScreenHeader
        title="팀 일정 관리"
        onBack={undefined}
        action={
          <div className="flex items-center gap-2">
            {/* 임시: 로그인(모듈2) 붙기 전 총무 보기 전환 스위치 */}
            <button
              type="button"
              onClick={toggleAdmin}
              className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-text-muted hover:border-primary"
            >
              {isAdmin ? "총무로 보는 중" : "구성원으로 보는 중"}
            </button>
            {/* P1: 총무에게만 "일정 추가" 버튼 표시 */}
            {isAdmin && (
              <Link href="/schedule-form" aria-label="일정 추가">
                <IconButton tone="primary">
                  <PlusIcon />
                </IconButton>
              </Link>
            )}
          </div>
        }
      />

      {isEmpty ? (
        // F2 예외: 일정이 0개면 "예정된 일정이 없습니다"
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-faint"
          >
            <rect x="3" y="5" width="18" height="16" rx="3"></rect>
            <path d="M8 3v4M16 3v4M3 10h18"></path>
          </svg>
          <p className="m-0 text-base text-text-muted">예정된 일정이 없습니다</p>
        </div>
      ) : (
        // F2: 다가오는 일정이 날짜순으로
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5 pb-6">
          {schedules.map((schedule) => (
            <Link
              key={schedule.title}
              href={`/schedule-detail/${encodeURIComponent(schedule.title)}`}
            >
              <ScheduleCard
                title={schedule.title}
                date={formatDate(schedule.date)}
                time={schedule.time}
                place={schedule.place}
                attendeeLabel={getAttendeeLabel(schedule.title)}
                changed={schedule.changed}
              />
            </Link>
          ))}
        </div>
      )}
    </Screen>
  );
}

/** 날짜를 "9월 12일(토)" 형식으로 변환 */
function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00`);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${month}월 ${day}일(${dayOfWeek})`;
}

/** 참석 정보를 "참석 8명" 형식으로 반환 */
function getAttendeeLabel(scheduleTitle: string): string {
  const attendances = getAttendances(scheduleTitle);
  const attendCount = attendances.filter((a) => a.answer === "참석").length;
  return `참석 ${attendCount}명`;
}
