import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Tile = {
  href: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export function TileGrid({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((t) => {
        const Icon = t.icon;
        return (
          <Link key={t.href} href={t.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  {Icon ? (
                    <Icon className="h-5 w-5 text-indigo-600" />
                  ) : null}
                  {t.title}
                </CardTitle>
              </CardHeader>
              {t.description ? (
                <CardContent className="text-sm text-muted-foreground">
                  {t.description}
                </CardContent>
              ) : null}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
