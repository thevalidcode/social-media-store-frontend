"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/use-user";
import { useAppContext } from "@/context/appContext";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useCreateUser();
  const { panel_id } = useAppContext(); // Get panel_id from context
  const queryClient = useQueryClient();

  // Check if panel_id is available
  if (!panel_id) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 mt-16">
        <Card className="w-full max-w-md shadow-xl mx-auto">
          <CardContent className="space-y-8 p-6 sm:p-8">
            <div className="text-center">
              <p className="text-destructive">
                Panel configuration not found. Please try again later.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const passwordRequirements = {
    length: {
      test: (pw: string) => pw.length >= 8,
      label: "At least 8 characters",
    },
    uppercase: {
      test: (pw: string) => /[A-Z]/.test(pw),
      label: "At least one uppercase letter",
    },
    lowercase: {
      test: (pw: string) => /[a-z]/.test(pw),
      label: "At least one lowercase letter",
    },
    special: {
      test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
      label: "At least one special character",
    },
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      // Check all password requirements
      if (!passwordRequirements.length.test(formData.password)) {
        newErrors.password = passwordRequirements.length.label;
      } else if (!passwordRequirements.uppercase.test(formData.password)) {
        newErrors.password = passwordRequirements.uppercase.label;
      } else if (!passwordRequirements.lowercase.test(formData.password)) {
        newErrors.password = passwordRequirements.lowercase.label;
      } else if (!passwordRequirements.special.test(formData.password)) {
        newErrors.password = passwordRequirements.special.label;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert panel_id to number for API call
      const panelIdNumber = parseInt(panel_id, 10);
      if (isNaN(panelIdNumber)) {
        setErrors({ general: "Invalid panel configuration" });
        return;
      }

      mutate({
        email: formData.email,
        password: formData.password,
        panel_id: panelIdNumber, // Use converted number
        username: formData.username,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  };

  // const searchUrl = useSearchParams();
  // const token = searchUrl.get("token");
  // console.log(token);
  //
  // if (token) {
  //   router.push(`/auth/signup?token=${token}`);
  // }
  // const redirect = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   router.push(
  //     "https://auth.validpanel.com/api/auth/panel/login/google?panel_id=35&redirect=http://localhost:3000/auth/signup",
  //   );
  // };
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:p-8 mt-16">
      <Card className="w-full max-w-md shadow-xl mx-auto">
        <CardContent className="space-y-8 p-6 sm:p-8">
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error Display */}
            {errors.general && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{errors.general}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? "border-destructive" : ""}
                autoComplete="username"
                required
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-destructive" : ""}
                autoComplete="email"
                required
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "border-destructive" : ""}
                  autoComplete="new-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {/* Live password requirements feedback */}

              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                  autoComplete="new-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isPending}>
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          {/* Additional Links */}
          <div className="flex flex-col items-center space-y-4 text-xs">
            <div className="flex space-x-4">
              <a href="#" className="hover:underline">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </div>
            <a
              href="#"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              Forgot your password?
            </a>
          </div>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium hover:underline text-primary"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6">
            <p className="text-xs flex items-center justify-center gap-1.5">
              <User className="w-3 h-3" />
              Your information is secure and protected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
