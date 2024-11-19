
"use client"

import { Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the schema for validation
const formSchema = z.object({
  email: z.string().min(5, {
    message: "Email must be longer than 5 characters",
  }).max(66),
  password: z.string().min(8, {
    message: "Password must be longer than 8 characters",
  }).max(66),
});

// Form submission handler
function onSubmit(values: z.infer<typeof formSchema>) {
  // This will be type-safe and validated
  console.log(values);
  
      window.location.href = "/home";

}

export default function Home() {
  // Set up the form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <main className="h-screen flex items-center justify-center p-10 rounded-md">
      {/* Form wrapper */}
      <div className="h-full bg-bgcolor box-anim flex items-center justify-center flex-col px-4 py-10 md:px-10 rounded-xl border-actioncolor">
        <div className="my-4">
          <h1 className="text-3xl font-semibold">Login</h1>
          <p className="mt-2 text-xs text-slate-400">
            See Your Growth and get consulting growth
          </p>
        </div>

        {/* Form component using Shadcn UI */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
            <Button
              className="flex items-center w-full gap-4 px-12 mb-4 bg-transparent rounded-full"
              variant="outline"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
             Dont have an account? Sign Up
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
                      className="mt-2 mb-4 bg-transparent rounded-full"
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
                      className="mt-2 bg-transparent rounded-full"
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

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full mt-6 bg-actioncolor rounded-full hover:bg-indigo-700"
            >
              Login
            </Button>
          </form>

        </Form>

        {/* Footer */}
        <p className="mt-4 text-xs text-slate-200">
          @2024 All rights reserved
        </p>
      </div>
    </main>
  );
}
