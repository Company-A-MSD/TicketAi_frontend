import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function timeSince(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle future dates
  if (seconds < 0) {
    return "in the future";
  }

  const intervals = [
    { label: "year", seconds: 31536000 }, // 365 days
    { label: "month", seconds: 2629746 }, // Average month (30.44 days)
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
export function getBadgeStyle(priority: string) {
  const p = priority.toLowerCase();

  switch (p) {
    case "high":
      return { backgroundColor: "red", color: "white" };

    case "medium":
    case "moderate":
      return { backgroundColor: "orange", color: "white" };

    case "low":
      return { backgroundColor: "green", color: "white" };

    default:
      return {};
  }
}
