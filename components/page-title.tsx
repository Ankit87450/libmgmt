import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageTitle({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {backHref ? (
        <Button asChild variant="outline" size="sm">
          <Link href={backHref}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
