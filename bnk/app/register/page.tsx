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

  name: z.string().min(2, {
    message: "Name must be longer than 2 characters",
  }).max(66),

  surname: z.string().min(2, {
    message: "Surname must be longer than 2 characters",
  }).max(66),

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
}

export default function Home() {
  // Set up the form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
  });

  return (
    <main className="h-screen flex items-center justify-center p-10 rounded-md">
      {/* Form wrapper */}
      <div className="w-full h-full bg-white box-anim flex items-center justify-center flex-col px-4 py-10 md:px-10 rounded-xl">
        <div className="my-4">
          <h1 className="text-3xl font-semibold">Register</h1>
        </div>

        {/* Form component using Shadcn UI */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
            <Button
              className="flex items-center w-full gap-4 px-12 mb-4 bg-transparent rounded-full"
              variant="outline"

              onClick={() => {
                window.location.href = "http://localhost:3000";
              }}

            >

              Have an account? Log-in

            </Button>

            {/* Password Input Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 bg-transparent rounded-full"
                      id="name"
                      type="name"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="surname">Surname</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 bg-transparent rounded-full"
                      id="surname"
                      type="surname"
                      placeholder="Surname"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />











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
              className="w-full mt-6 bg-indigo-600 rounded-full hover:bg-indigo-700"

              onClick={form.handleSubmit((values) => {
                console.log(values);
                window.location.href = "http://localhost:3000";
              })}
            >

              Register
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
