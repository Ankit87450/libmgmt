import type { Category, ItemKind } from "./types";
import { CATEGORY_PREFIX } from "./types";

export function makeSerial(
  category: Category,
  kind: ItemKind,
  seq: number,
): string {
  const prefix = CATEGORY_PREFIX[category];
  const k = kind === "book" ? "B" : "M";
  return `${prefix}(${k})${String(seq).padStart(6, "0")}`;
}

export function nextSeq(existing: string[]): number {
  let max = 0;
  for (const s of existing) {
    const m = s.match(/\((?:B|M)\)(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return max + 1;
}
