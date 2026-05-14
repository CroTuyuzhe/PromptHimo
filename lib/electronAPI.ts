interface ElectronAPI {
  saveImage: (arrayBuffer: ArrayBuffer, filename: string) => Promise<{ ok: boolean; filename: string }>;
  deleteImage: (filename: string) => Promise<{ ok: boolean }>;
  getImageUrl: (filename: string) => string;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export function isElectronEnv(): boolean {
  return typeof window !== "undefined" && !!window.electronAPI?.isElectron;
}

export function getElectronAPI(): ElectronAPI | null {
  if (typeof window === "undefined") return null;
  return window.electronAPI ?? null;
}

export function getPresetImageUrl(filename: string | undefined): string | null {
  if (!filename) return null;
  const api = getElectronAPI();
  if (api) return api.getImageUrl(filename);
  return null;
}
