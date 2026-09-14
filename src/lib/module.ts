import { cookies } from "next/headers";
import { CURRENT_MODULE, isModuleSlug, type ModuleSlug } from "@/content/modules";

export const MODULE_COOKIE = "module";

/** 헤더 탭에서 고른 모듈. 안 골랐거나 이상한 값이면 지금 진행 중인 모듈 */
export async function getModule(): Promise<ModuleSlug> {
  const v = (await cookies()).get(MODULE_COOKIE)?.value;
  return isModuleSlug(v) ? v : CURRENT_MODULE;
}
