import { type ClassValue, clsx } from "clsx";

/**
 * Utility to construct className strings conditionally.
 * Removed tailwind-merge as we are no longer using Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}
