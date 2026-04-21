"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { transactionsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";
import {
  useItemsQuery,
  useIssuesQuery,
  useMarkReturnMutation,
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
import { returnSchema, type ReturnValues } from "@/schemas/return";

export function ReturnPage() {
  const router = useRouter();
  const roleCtx = useRoleBase();
  const { data: issuesData } = useIssuesQuery();
  const { data: itemsData } = useItemsQuery();
  const [markReturn, { isLoading }] = useMarkReturnMutation();

  const issues = issuesData?.issues ?? [];
  const items = itemsData?.items ?? [];
  const activeIssues = useMemo(
    () => issues.filter((i) => i.status === "Active"),
    [issues],
  );

  const form = useForm<ReturnValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      issueId: "",
      bookName: "",
      author: "",
      serialNo: "",
      issueDate: "",
      returnDate: format(new Date(), "yyyy-MM-dd"),
      remarks: "",
    },
  });

  const watchIssueId = form.watch("issueId");

  useEffect(() => {
    const issue = issues.find((i) => i.id === watchIssueId);
    if (!issue) {
      form.setValue("bookName", "");
      form.setValue("author", "");
      form.setValue("serialNo", "");
      form.setValue("issueDate", "");
      form.setValue("returnDate", format(new Date(), "yyyy-MM-dd"));
      return;
    }
    const item = items.find((i) => i.serialNo === issue.serialNo);
    form.setValue("bookName", item?.name ?? issue.serialNo);
    form.setValue("author", item?.author ?? "");
    form.setValue("serialNo", issue.serialNo);
    form.setValue("issueDate", issue.issueDate);
    form.setValue("returnDate", issue.returnDueDate);
  }, [watchIssueId, issues, items, form]);

  if (roleCtx.loading || !roleCtx.role) return null;
  const { role, base } = roleCtx;

  const onSubmit = async (v: ReturnValues) => {
    const res = await markReturn({
      id: v.issueId,
      actualReturnDate: v.returnDate,
      remarks: v.remarks,
    });
    if ("error" in res) {
      form.setError("issueId", { message: "Failed to mark return" });
      return;
    }
    router.push(`${base}/transactions/pay-fine?id=${v.issueId}`);
  };

  return (
    <>
      <PageTitle title="Return Book" backHref={`${base}/transactions`} />
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
                name="issueId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Active Issue</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick an active issue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeIssues.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            No active issues
                          </SelectItem>
                        ) : (
                          activeIssues.map((i) => {
                            const it = items.find(
                              (x) => x.serialNo === i.serialNo,
                            );
                            return (
                              <SelectItem key={i.id} value={i.id}>
                                {i.id} · {it?.name ?? i.serialNo} · member{" "}
                                {i.memberId}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bookName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Name (auto)</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
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
                name="serialNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial No</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date (auto)</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
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
                    <FormLabel>Return Date (editable)</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
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
