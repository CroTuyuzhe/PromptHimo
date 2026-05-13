import { PromptDatabase } from "./types";

const STORAGE_KEY = "prompthimo_data";

export function getPromptData(): PromptDatabase | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PromptDatabase;
  } catch {
    return null;
  }
}

export function hasPromptData(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export function savePromptData(json: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed.jewelryTypes) || parsed.jewelryTypes.length === 0) {
      return { ok: false, error: "缺少 jewelryTypes 字段" };
    }
    if (!Array.isArray(parsed.categories) || parsed.categories.length === 0) {
      return { ok: false, error: "缺少 categories 字段" };
    }
    if (!parsed.basePrompts || typeof parsed.basePrompts !== "object") {
      return { ok: false, error: "缺少 basePrompts 字段" };
    }
    if (!Array.isArray(parsed.photoModes) || parsed.photoModes.length === 0) {
      return { ok: false, error: "缺少 photoModes 字段" };
    }
    if (!Array.isArray(parsed.presets)) {
      parsed.presets = [];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return { ok: true };
  } catch {
    return { ok: false, error: "JSON 格式无效" };
  }
}

export function clearPromptData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getDataStats(): { types: number; categories: number; options: number } | null {
  const data = getPromptData();
  if (!data) return null;
  const options = data.categories.reduce((sum, c) => sum + c.options.length, 0);
  return {
    types: data.jewelryTypes.length,
    categories: data.categories.length,
    options,
  };
}
