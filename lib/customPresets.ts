import { CustomPreset } from "./types";

const STORAGE_KEY = "promptforge_custom_presets";

function readAll(): CustomPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(presets: CustomPreset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function getCustomPresets(jewelryType: string): CustomPreset[] {
  return readAll().filter((p) => p.jewelryType === jewelryType);
}

export function saveCustomPreset(preset: CustomPreset) {
  const all = readAll();
  all.push(preset);
  writeAll(all);
}

export function deleteCustomPreset(id: string) {
  writeAll(readAll().filter((p) => p.id !== id));
}
