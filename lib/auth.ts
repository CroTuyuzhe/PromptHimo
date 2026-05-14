const SESSION_KEY = "prompthimo_unlocked";
const PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  if (!PASSWORD) return true;
  return localStorage.getItem(SESSION_KEY) === "1";
}

export function unlock(input: string): boolean {
  if (!PASSWORD) return true;
  if (input === PASSWORD) {
    localStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

export function lock(): void {
  localStorage.removeItem(SESSION_KEY);
}
