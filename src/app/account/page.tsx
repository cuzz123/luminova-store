import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { AccountContent } from "./AccountContent";

export const metadata: Metadata = {
  title: "My Account — Flint & Beam",
  description: "Manage your Flint & Beam account, view order history, and update your profile.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-10 lg:py-16">
        <h1
          className="text-3xl font-medium mb-10"
          style={{ color: "var(--heading)" }}
        >
          My Account
        </h1>

        <AccountContent user={session.user} />
      </div>
    </div>
  );
}
