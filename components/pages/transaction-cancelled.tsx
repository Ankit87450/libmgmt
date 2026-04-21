"use client";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoleBase } from "@/lib/role";

export function TransactionCancelledPage() {
  const ctx = useRoleBase();
  const base = ctx.base ?? "/login";
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-amber-600" />
            Transaction cancelled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>No changes were saved.</p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`${base}/home`}>Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login/logout">Log Out</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
