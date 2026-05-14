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

export async function deleteCustomPreset(id: string) {
  const all = readAll();
  const target = all.find((p) => p.id === id);
  if (target?.referenceImage && window.electronAPI) {
    await window.electronAPI.deleteImage(target.referenceImage);
  }
  writeAll(all.filter((p) => p.id !== id));
}
