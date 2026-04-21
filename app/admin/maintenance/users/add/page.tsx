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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { addUserSchema, type AddUserValues } from "@/schemas/appUser";
import {
  useUsersQuery,
  useAddUserMutation,
  usePatchUserMutation,
} from "@/features/api";

export default function AddUserPage() {
  const router = useRouter();
  const { data } = useUsersQuery();
  const users = data?.users ?? [];
  const [addUser, { isLoading: addLoading }] = useAddUserMutation();
  const [patchUser, { isLoading: patchLoading }] = usePatchUserMutation();

  const form = useForm<AddUserValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      mode: "new",
      existingId: "",
      name: "",
      active: true,
      isAdmin: false,
    },
  });

  const mode = form.watch("mode");
  const existingId = form.watch("existingId");

  useEffect(() => {
    if (mode === "existing" && existingId) {
      const u = users.find((x) => x.id === existingId);
      if (u) {
        form.setValue("name", u.name);
        form.setValue("active", u.active);
        form.setValue("isAdmin", u.isAdmin);
      }
    }
  }, [mode, existingId, users, form]);

  const onSubmit = async (v: AddUserValues) => {
    if (v.mode === "existing") {
      if (!v.existingId) {
        form.setError("existingId", { message: "Pick an existing user." });
        return;
      }
      const res = await patchUser({
        id: v.existingId,
        patch: { name: v.name, active: v.active, isAdmin: v.isAdmin },
      });
      if ("error" in res) {
        form.setError("name", { message: "Failed to save" });
        return;
      }
      router.push("/admin/success?action=user-update");
      return;
    }
    const res = await addUser({
      name: v.name,
      active: v.active,
      isAdmin: v.isAdmin,
    });
    if ("error" in res) {
      form.setError("name", { message: "Failed to save" });
      return;
    }
    router.push("/admin/success?action=user-add");
  };

  return (
    <>
      <PageTitle title="User Management · Add" backHref="/admin/maintenance" />
      <ModuleNav items={maintenanceNav()} />
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Alert>
            <AlertDescription className="text-xs">
              When a new user is added, a username is derived from the name (e.g.
              &ldquo;John Doe&rdquo; → <code>johndoe</code>) and the first name
              becomes the default password. Admin can change the password via
              the API if needed. Credentials are stored in the JSON-file DB.
            </AlertDescription>
          </Alert>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Mode</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="new" id="m-new" />
                          <Label htmlFor="m-new">New User</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="existing" id="m-existing" />
                          <Label htmlFor="m-existing">Existing User</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {mode === "existing" ? (
                <FormField
                  control={form.control}
                  name="existingId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Pick existing</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
              ) : null}
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
                <Button type="submit" disabled={addLoading || patchLoading}>
                  {addLoading || patchLoading ? "Saving…" : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
