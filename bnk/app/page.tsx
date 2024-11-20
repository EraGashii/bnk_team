"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Cookies from "js-cookie"; // Define the schema for validation

const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email must be longer than 5 characters" })
    .max(66),
  password: z
    .string()
    .min(8, { message: "Password must be longer than 8 characters" })
    .max(66),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Handle token validation and redirection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  // Initialize form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
try {
    const response = await fetch("http://localhost:3001/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // Store the token in a cookie (expires in 1 hour)
    Cookies.set("token", data.token, { expires: 1 / 24 }); // 1 hour expiry
    router.push("/home");
  } catch (err) {
    console.error("Error during login:", err);
    setError("An error occurred while logging in. Please try again.");
  }
  }

  return (
    <main className="h-screen flex items-center justify-center p-10">
      {/* Form Wrapper */}
      <div className="h-full bg-white box-anim flex items-center justify-center flex-col px-4 py-10 md:px-10 rounded-xl border-actioncolor">
        <div className="my-4">
          <h1 className="text-black text-3xl font-semibold">Sign In</h1>
        </div>

        {/* Display Error Message */}
        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        {/* Form Component using Shadcn UI */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-6"
          >
            {/* Sign Up Redirect Button */}
            <Button
              className="flex items-center w-full gap-4 px-12 mb-4 bg-transparent rounded-full"
              variant="outline"
              onClick={() => router.push("/register")}
            >
              Don’t have an account? Sign Up
            </Button>

            {/* Email Input Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 mt-2 mb-4 bg-transparent rounded-full"
                      id="email"
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Input Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 mt-2 bg-transparent rounded-full"
                      id="password"
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full mt-6 text-black bg-actioncolor rounded-full hover:bg-indigo-700"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="mt-4 text-xs text-slate-300">
          &copy; 2024 All rights reserved
        </p>
      </div>
    </main>
  );
}
