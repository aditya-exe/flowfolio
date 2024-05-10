import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createFormSchema = z.object({
  projectName: z.string().min(1),
  owner: z.string().min(3),
  columns: z.array(z.object({  name: z.string() })).min(1),
});

export type TCreateFormSchema = z.infer<typeof createFormSchema>;
