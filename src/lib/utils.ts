import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SortKey = 'date' | 'confidence' | 'faceCount';

export function sortImages<T extends { uploadedAt?: Date | string; confidence?: number; faceCount?: number }>(
  images: T[],
  key: SortKey,
  dir: 'asc' | 'desc' = 'desc'
): T[] {
  const copy = [...images];

  copy.sort((a, b) => {
    let aa: number | string = '';
    let bb: number | string = '';

    if (key === 'date') {
      aa = a.uploadedAt ? new Date(a.uploadedAt as string).getTime() : 0;
      bb = b.uploadedAt ? new Date(b.uploadedAt as string).getTime() : 0;
    } else if (key === 'confidence') {
      aa = a.confidence ?? 0;
      bb = b.confidence ?? 0;
    } else if (key === 'faceCount') {
      aa = a.faceCount ?? 0;
      bb = b.faceCount ?? 0;
    }

    const diff = (bb as number) - (aa as number);
    return dir === 'desc' ? diff : -diff;
  });

  return copy;
}
