import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTags(tagsString: string | null): { id: number; name: string }[] {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => {
    const [id, name] = tag.split(':');
    return { id: parseInt(id), name };
  });
}
