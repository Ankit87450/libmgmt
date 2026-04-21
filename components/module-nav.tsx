"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type ModuleNavItem = { href: string; label: string };

export function ModuleNav({ items }: { items: ModuleNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="mb-4 flex flex-wrap gap-2 rounded-md border bg-white p-2 text-sm">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded px-3 py-1.5 transition-colors",
              active
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
