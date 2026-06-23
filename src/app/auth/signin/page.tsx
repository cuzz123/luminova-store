"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email.trim()) {
        setError("Please enter your email");
        return;
      }
      if (!password) {
        setError("Please enter your password");
        return;
      }

      setLoading(true);
      try {
        const result = await signIn("credentials", {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(
            result.error === "CredentialsSignin"
              ? "Invalid email or password"
              : "Something went wrong. Please try again.",
          );
        } else if (result?.ok) {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, callbackUrl, router],
  );

  const handleGoogleSignIn = useCallback(async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setGoogleLoading(false);
      setError("Failed to sign in with Google. Please try again.");
    }
  }, [callbackUrl]);

  const authError =
    errorParam === "OAuthSignin"
      ? "There was a problem starting the sign-in process."
      : errorParam === "OAuthCallback"
        ? "There was a problem with the authentication provider."
        : errorParam === "OAuthAccountNotLinked"
          ? "This email is already associated with another sign-in method."
          : errorParam === "CredentialsSignin"
            ? "Invalid email or password."
            : errorParam
              ? "An authentication error occurred."
              : "";

  const displayError = error || authError;

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
              Welcome Back
            </h1>
            <p style={{ color: "var(--body)" }}>
              Sign in to your Flint & Beam account
            </p>
          </div>

          {/* Error display */}
          {displayError && (
            <div
              className="mb-6 p-3 rounded-md text-sm"
              style={{
                backgroundColor: "rgba(194,91,62,0.1)",
                color: "var(--accent)",
              }}
            >
              {displayError}
            </div>
          )}

          {/* Credentials form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
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
                  setError("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--heading)",
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ color: "var(--heading)" }}
                >
                  Password
                </label>
                <Link
                  href="/auth/reset-password"
                  className="text-xs hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-md border bg-white text-sm transition-colors"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--heading)",
                  }}
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 rounded-md text-white font-medium transition-colors",
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90",
              )}
              style={{ backgroundColor: "var(--dark)" }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Sign In
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

          {/* Google sign-in */}
          <button
            onClick={handleGoogleSignIn}
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

          {/* Register link */}
          <p
            className="text-center text-sm mt-8"
            style={{ color: "var(--body)" }}
          >
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Create one
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
