import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS classlarini xavfsiz birlashtirish uchun yordamchi funksiya.
 * 
 * @example
 * cn("p-4", isActive && "bg-blue-500", "text-white")
 * // => "p-4 bg-blue-500 text-white"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
