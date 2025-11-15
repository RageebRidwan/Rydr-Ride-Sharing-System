import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatCurrency(amount: number): string {
  return `৳${amount.toFixed(2)}`;
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy hh:mm a");
}

export function getRideStatusColor(status: string): string {
  const colors: Record<string, string> = {
    requested:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    picked_up:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    in_transit:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getUserStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    blocked: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    suspended:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getApprovalStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatRideStatus(status: string): string {
  return status.split("_").map(capitalizeFirst).join(" ");
}
