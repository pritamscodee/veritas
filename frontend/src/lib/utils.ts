import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "badge-yellow",
    registration: "badge-blue",
    voting: "badge-green",
    tallying: "badge-yellow",
    completed: "badge-green",
    cancelled: "badge-red",
  };
  return colors[status] || "badge";
}

export function generateNullifier(accountId: string, electionId: string): string {
  let hash = "";
  const str = accountId + electionId;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash.charCodeAt(0) << 5) - hash.charCodeAt(0) + str.charCodeAt(i)).toString(16);
  }
  return hash.padStart(64, "0");
}
