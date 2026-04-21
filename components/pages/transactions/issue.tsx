"use client";
import { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, startOfDay } from "date-fns";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { transactionsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";
import {
  useItemsQuery,
  useMembersQuery,
  useIssueBookMutation,
} from "@/features/api";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/date-picker";
import { issueSchema, type IssueValues } from "@/schemas/issue";

const todayISO = () => format(startOfDay(new Date()), "yyyy-MM-dd");

function IssueFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const roleCtx = useRoleBase();
  const { data: itemsData } = useItemsQuery();
  const { data: membersData } = useMembersQuery();
  const [issueBook, { isLoading }] = useIssueBookMutation();

  const items = itemsData?.items ?? [];
  const members = membersData?.members ?? [];
  const available = useMemo(
    () => items.filter((i) => i.status === "Available"),
    [items],
  );
  const activeMembers = useMemo(
    () => members.filter((m) => m.status === "Active"),
    [members],
  );

  const preselected = params.get("serial") ?? "";
  const issueDefault = todayISO();

  const form = useForm<IssueValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      serialNo: preselected,
      bookName: "",
      author: "",
      memberId: "",
      issueDate: issueDefault,
      returnDate: format(addDays(new Date(issueDefault), 15), "yyyy-MM-dd"),
      remarks: "",
    },
  });

  const watchSerial = form.watch("serialNo");
  const watchIssue = form.watch("issueDate");

  useEffect(() => {
    const it = items.find((i) => i.serialNo === watchSerial);
    if (it) {
      form.setValue("bookName", it.name);
      form.setValue("author", it.author);
    } else {
      form.setValue("bookName", "");
      form.setValue("author", "");
    }
  }, [watchSerial, items, form]);

  useEffect(() => {
    if (watchIssue) {
      form.setValue(
        "returnDate",
        format(addDays(new Date(watchIssue), 15), "yyyy-MM-dd"),
      );
    }
  }, [watchIssue, form]);

  if (roleCtx.loading || !roleCtx.role) return null;
  const { role, base } = roleCtx;

  const onSubmit = async (v: IssueValues) => {
    const res = await issueBook({
      serialNo: v.serialNo,
      memberId: v.memberId,
      issueDate: v.issueDate,
      returnDueDate: v.returnDate,
      remarks: v.remarks,
    });
    if ("error" in res) {
      const data = (res.error as { data?: { error?: string } }).data;
      form.setError("serialNo", {
        message: data?.error ?? "Could not issue book",
      });
      return;
    }
    router.push(`${base}/success?action=issue`);
  };

  return (
    <>
      <PageTitle title="Book Issue" backHref={`${base}/transactions`} />
      <ModuleNav items={transactionsNav(role)} />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="serialNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Book Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an available title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {available.map((i) => (
                          <SelectItem key={i.serialNo} value={i.serialNo}>
                            {i.name} ({i.serialNo})
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
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name (auto)</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeMembers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id} — {m.firstName} {m.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="hidden md:block" />
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        minDate={startOfDay(new Date())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date (max 15 days)</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        minDate={new Date(form.getValues("issueDate"))}
                        maxDate={addDays(
                          new Date(form.getValues("issueDate")),
                          15,
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Remarks (optional)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`${base}/cancelled`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving…" : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export function IssuePage() {
  return (
    <Suspense fallback={null}>
      <IssueFormInner />
    </Suspense>
  );
}
