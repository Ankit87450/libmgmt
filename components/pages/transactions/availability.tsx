"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { transactionsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";
import { useAppSelector } from "@/lib/hooks";
import { CATEGORIES, type Item } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  availabilitySchema,
  type AvailabilityValues,
} from "@/schemas/availability";

export function AvailabilityPage() {
  const router = useRouter();
  const { role, base } = useRoleBase();
  const items = useAppSelector((s) => s.catalog.items);
  const [results, setResults] = useState<Item[] | null>(null);
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null);

  const form = useForm<AvailabilityValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      bookName: "",
      author: "",
      categoryBook: "",
      categoryMovie: "",
    },
  });

  const onSubmit = (v: AvailabilityValues) => {
    const filters = {
      bookName: v.bookName?.trim().toLowerCase() ?? "",
      author: v.author?.trim().toLowerCase() ?? "",
      categoryBook: v.categoryBook ?? "",
      categoryMovie: v.categoryMovie ?? "",
    };
    const matched = items.filter((i) => {
      if (filters.bookName && !i.name.toLowerCase().includes(filters.bookName))
        return false;
      if (filters.author && !i.author.toLowerCase().includes(filters.author))
        return false;
      if (filters.categoryBook) {
        if (i.kind !== "book" || i.category !== filters.categoryBook)
          return false;
      }
      if (filters.categoryMovie) {
        if (i.kind !== "movie" || i.category !== filters.categoryMovie)
          return false;
      }
      return true;
    });
    setResults(matched);
    setSelectedSerial(null);
  };

  const goIssue = () => {
    if (selectedSerial) {
      router.push(
        `${base}/transactions/issue?serial=${encodeURIComponent(selectedSerial)}`,
      );
    }
  };

  return (
    <>
      <PageTitle
        title="Book Availability"
        backHref={`${base}/transactions`}
      />
      <ModuleNav items={transactionsNav(role)} />
      <Card>
        <CardHeader>
          <CardTitle>Search the catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="bookName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Book Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Atomic Habits" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Author</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. James Clear" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryBook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryMovie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movie Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setResults(null);
                    setSelectedSerial(null);
                  }}
                >
                  Reset
                </Button>
                <Button type="submit">Search</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {results ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              Search Results ({results.length}{" "}
              {results.length === 1 ? "item" : "items"})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No items match those criteria.
              </p>
            ) : (
              <RadioGroup
                value={selectedSerial ?? ""}
                onValueChange={setSelectedSerial}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book/Movie</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Serial No</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Select</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((r) => {
                      const available = r.status === "Available";
                      return (
                        <TableRow key={r.serialNo}>
                          <TableCell className="capitalize">
                            {r.kind}
                          </TableCell>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{r.author}</TableCell>
                          <TableCell>{r.serialNo}</TableCell>
                          <TableCell>{available ? "Y" : "N"}</TableCell>
                          <TableCell>
                            {available ? (
                              <RadioGroupItem value={r.serialNo} />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </RadioGroup>
            )}
            {results.some((r) => r.status === "Available") ? (
              <div className="mt-4 flex justify-end">
                <Button onClick={goIssue} disabled={!selectedSerial}>
                  Proceed to Issue
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
