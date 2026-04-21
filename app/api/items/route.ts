import { NextResponse } from "next/server";
import { mutate, readDb } from "@/lib/server/db";
import { requireAdmin, requireSession } from "@/lib/server/guard";
import { makeSerial, nextSeq } from "@/lib/code";
import type { Category, ItemKind } from "@/lib/types";

export async function GET() {
  const auth = await requireSession();
  if (!auth.ok) return auth.response;
  const db = await readDb();
  return NextResponse.json({ items: db.items });
}

type AddBody = {
  kind: ItemKind;
  name: string;
  author: string;
  category: Category;
  procurementDate: string;
  quantity: number;
  cost?: number;
};

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;
  const body = (await req.json()) as AddBody;
  const created = await mutate((db) => {
    const quantity = Math.max(1, body.quantity || 1);
    const makeOne = () => {
      const serials = db.items
        .filter((i) => i.category === body.category && i.kind === body.kind)
        .map((i) => i.serialNo);
      const seq = nextSeq(serials);
      const serial = makeSerial(body.category, body.kind, seq);
      const item = {
        id: serial,
        kind: body.kind,
        name: body.name,
        author: body.author,
        category: body.category,
        serialNo: serial,
        status: "Available" as const,
        cost: body.cost ?? 0,
        procurementDate: body.procurementDate,
        quantity: 1,
      };
      db.items.push(item);
      return item;
    };
    const out = [];
    for (let i = 0; i < quantity; i++) out.push(makeOne());
    return out;
  });
  return NextResponse.json({ items: created }, { status: 201 });
}
