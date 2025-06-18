// lib/theme.ts
export function applyPrimaryColor(color: string) {
  if (typeof window !== "undefined" && document?.documentElement) {
    document.documentElement.style.setProperty("--primary", color);
  }
}

export function getSavedPrimaryColor(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("primaryColor");
}

export function savePrimaryColor(color: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("primaryColor", color);
  }
}
