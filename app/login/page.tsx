"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login, type Role } from "@/features/auth/authSlice";
import { loginSchema, type LoginValues } from "@/schemas/login";

function LoginForm({ role }: { role: Role }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users.users);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: LoginValues) => {
    const match = users.find(
      (u) =>
        u.username === values.username &&
        u.password === values.password &&
        u.active &&
        (role === "admin" ? u.isAdmin : !u.isAdmin),
    );
    if (!match) {
      setError(
        role === "admin"
          ? "Invalid admin credentials. Try adm / adm."
          : "Invalid user credentials. Try user / user.",
      );
      return;
    }
    setError(null);
    dispatch(login({ username: match.username, role }));
    router.push(role === "admin" ? "/admin/home" : "/user/home");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input autoComplete="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between gap-3 pt-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/chart">
              <Network className="mr-1 h-4 w-4" /> Chart
            </Link>
          </Button>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </Form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <CardTitle>Library Management System</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Pick a role to log in. Seeded: <code>adm / adm</code> and{" "}
            <code>user / user</code>.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user" className="pt-4">
              <LoginForm role="user" />
            </TabsContent>
            <TabsContent value="admin" className="pt-4">
              <LoginForm role="admin" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
