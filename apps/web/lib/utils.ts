import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    GENERATING: "bg-blue-100 text-blue-700",
    VALIDATING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    SCHEDULED: "bg-purple-100 text-purple-700",
    PUBLISHING: "bg-orange-100 text-orange-700",
    PUBLISHED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-700",
    REJECTED: "bg-red-100 text-red-800",
    PENDING_APPROVAL: "bg-amber-100 text-amber-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

export function truncate(str: string, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
