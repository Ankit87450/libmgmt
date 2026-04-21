"use client";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoleBase } from "@/lib/role";

const ACTION_LABEL: Record<string, string> = {
  issue: "Book issue",
  return: "Book return",
  "add-membership": "Add membership",
  "update-membership": "Update membership",
  "add-book": "Add book/movie",
  "update-book": "Update book/movie",
  "user-add": "User add",
  "user-update": "User update",
};

function Inner() {
  const ctx = useRoleBase();
  const params = useSearchParams();
  const action = params.get("action") ?? "";
  const label = ACTION_LABEL[action] ?? "Transaction";
  const base = ctx.base ?? "/login";
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            {label} completed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Transaction completed successfully.</p>
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

export function TransactionSuccessPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
