"use client";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { reportsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";
import { useItemsQuery } from "@/features/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export function BooksReport({ kind }: { kind: "book" | "movie" }) {
  const ctx = useRoleBase();
  const { data, isLoading } = useItemsQuery();
  const items = (data?.items ?? []).filter((i) => i.kind === kind);
  if (ctx.loading || !ctx.role) return null;
  const { role, base } = ctx;
  return (
    <>
      <PageTitle
        title={kind === "book" ? "Master List of Books" : "Master List of Movies"}
        backHref={`${base}/reports`}
      />
      <ModuleNav items={reportsNav(role)} />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial No</TableHead>
                <TableHead>Name of {kind === "book" ? "Book" : "Movie"}</TableHead>
                <TableHead>{kind === "book" ? "Author" : "Director"}</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Cost (₹)</TableHead>
                <TableHead>Procurement Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No {kind === "book" ? "books" : "movies"} on record.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((i) => (
                  <TableRow key={i.serialNo}>
                    <TableCell className="font-mono">{i.serialNo}</TableCell>
                    <TableCell>{i.name}</TableCell>
                    <TableCell>{i.author}</TableCell>
                    <TableCell>{i.category}</TableCell>
                    <TableCell>{i.status}</TableCell>
                    <TableCell className="text-right">{i.cost}</TableCell>
                    <TableCell>{i.procurementDate}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
