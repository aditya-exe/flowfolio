import { env } from "@/env";
import { createClient } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// supabase storage
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_API_KEY,
);

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const FLOWFOLIO_HEADERS = "flowfolio_headers";
