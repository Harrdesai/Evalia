//  src/page/register.jsx

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be atleast of 6 characters"),
  role: z.enum(["USER", "ADMIN", "CLIENT"]),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { signup, isSigninUp } = useAuthStore();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      console.log("register data", data);
    } catch (error) {
      console.error("register failed", error);
    }
  };

  return (
    <div className="w-screen flex items-center justify-center flex-col">
      {/* Logo */}
      <div className="text-center">
        <div className="flex flex-col items-center gap-2 group">
          <h1 className="text-4xl font-extrabold z-10 text-center text-stone-400">
            Welcome to <span className="text-amber-500">Evalia</span>
          </h1>
          <p className="text-base-content/60">Create your account</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Role" autoComplete="off" {...field} type="hidden" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Name" autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" autoComplete="off" {...field} />
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
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      placeholder="Password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {isSigninUp ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;