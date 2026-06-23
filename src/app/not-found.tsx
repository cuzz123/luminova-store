import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p
        className="mb-2 font-sans text-8xl font-light leading-none tracking-tight"
        style={{ color: "var(--gold)" }}
      >
        404
      </p>
      <h1
        className="mb-3 font-sans text-2xl font-medium tracking-tight"
        style={{ color: "var(--heading)" }}
      >
        Page not found
      </h1>
      <p className="mb-8 max-w-md" style={{ color: "var(--body)" }}>
        The page you&apos;re looking for doesn&apos;t exist. It may have been
        moved, removed, or the URL may be mistyped.
      </p>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Go home
        </Link>
        <Link
          href="/products"
          className="rounded-md border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: "var(--border)", color: "var(--heading)" }}
        >
          Browse shop
        </Link>
      </div>
    </div>
  );
}
