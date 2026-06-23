"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return undefined;
}

function validateName(name: string): string | undefined {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    const nameError = validateName(name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.field === "email") {
            setErrors((prev) => ({
              ...prev,
              email: data.message || "This email is already registered",
            }));
          } else {
            toast.error(data.message || "Registration failed. Please try again.");
          }
          return;
        }

        toast.success("Account created! Signing you in...");

        // Auto sign in after registration
        const signInResult = await signIn("credentials", {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push("/account");
          router.refresh();
        } else {
          router.push("/auth/signin");
        }
      } catch {
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, validate, router],
  );

  const handleGoogleSignUp = useCallback(async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/account" });
    } catch {
      setGoogleLoading(false);
      toast.error("Failed to sign up with Google. Please try again.");
    }
  }, []);

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-md">
        <div
          className="rounded-xl border p-8"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-medium mb-2"
              style={{ color: "var(--heading)" }}
            >
              Create an Account
            </h1>
            <p style={{ color: "var(--body)" }}>
              Join Flint & Beam for order tracking, wishlists, and more.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--heading)" }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Your name"
                autoComplete="name"
                className={cn(
                  "w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors",
                  errors.name ? "border-red-500" : "border-[#ebebeb]",
                )}
                style={{ color: "var(--heading)" }}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--heading)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className={cn(
                  "w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors",
                  errors.email ? "border-red-500" : "border-[#ebebeb]",
                )}
                style={{ color: "var(--heading)" }}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--heading)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-md border bg-white text-sm transition-colors",
                    errors.password ? "border-red-500" : "border-[#ebebeb]",
                  )}
                  style={{ color: "var(--heading)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: "var(--body)" }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: "var(--body)" }} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--heading)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-md border bg-white text-sm transition-colors",
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#ebebeb]",
                  )}
                  style={{ color: "var(--heading)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: "var(--body)" }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: "var(--body)" }} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-md text-white font-medium transition-colors",
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90",
              )}
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border)" }}
            />
            <span className="text-xs" style={{ color: "var(--body)" }}>
              OR
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border)" }}
            />
          </div>

          {/* Google sign-up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-3 rounded-md border font-medium text-sm transition-colors",
              googleLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-gray-50",
            )}
            style={{
              borderColor: "var(--border)",
              color: "var(--heading)",
            }}
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GoogleIcon className="w-5 h-5" />
            )}
            Continue with Google
          </button>

          {/* Sign in link */}
          <p
            className="text-center text-sm mt-8"
            style={{ color: "var(--body)" }}
          >
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Google Icon                                                        */
/* ------------------------------------------------------------------ */

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
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
  );
}
