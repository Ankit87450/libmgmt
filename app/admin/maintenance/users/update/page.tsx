"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { maintenanceNav } from "@/lib/nav";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateUserSchema, type UpdateUserValues } from "@/schemas/appUser";
import { useUsersQuery, usePatchUserMutation } from "@/features/api";

export default function UpdateUserPage() {
  const router = useRouter();
  const { data } = useUsersQuery();
  const users = data?.users ?? [];
  const [patchUser, { isLoading }] = usePatchUserMutation();

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      existingId: "",
      name: "",
      active: true,
      isAdmin: false,
    },
  });

  const existingId = form.watch("existingId");

  useEffect(() => {
    if (!existingId) return;
    const u = users.find((x) => x.id === existingId);
    if (u) {
      form.setValue("name", u.name);
      form.setValue("active", u.active);
      form.setValue("isAdmin", u.isAdmin);
    }
  }, [existingId, users, form]);

  const onSubmit = async (v: UpdateUserValues) => {
    const res = await patchUser({
      id: v.existingId,
      patch: { name: v.name, active: v.active, isAdmin: v.isAdmin },
    });
    if ("error" in res) {
      form.setError("name", { message: "Failed to save" });
      return;
    }
    router.push("/admin/success?action=user-update");
  };

  return (
    <>
      <PageTitle
        title="User Management · Update"
        backHref="/admin/maintenance"
      />
      <ModuleNav items={maintenanceNav()} />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="existingId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Pick user</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.id} — {u.name} ({u.username})
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
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Active</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Admin</FormLabel>
                  </FormItem>
                )}
              />
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/cancelled")}
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
