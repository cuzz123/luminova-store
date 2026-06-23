/* ------------------------------------------------------------------ */
/*  Product Detail — Loading Skeleton                                  */
/*  Matches the page layout: breadcrumb, two-column (gallery + info),   */
/*  features, reviews, and related products.                            */
/* ------------------------------------------------------------------ */

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Breadcrumb skeleton ────────────────────────────────── */}
      <div className="mb-8 flex items-center gap-1.5">
        <div className="h-4 w-12 animate-pulse rounded bg-[#f5f3f0]" />
        <div className="h-3.5 w-3.5 text-[#e1dcd0]" aria-hidden="true">
          /
        </div>
        <div className="h-4 w-20 animate-pulse rounded bg-[#f5f3f0]" />
        <div className="h-3.5 w-3.5 text-[#e1dcd0]" aria-hidden="true">
          /
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-[#f5f3f0]" />
      </div>

      {/* ── Two-column layout: Gallery + Info ────────────────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Image placeholder */}
        <div className="aspect-square animate-pulse rounded-lg bg-[#f5f3f0]" />

        {/* Right: Info skeletons */}
        <div className="space-y-4">
          {/* Category tag bar */}
          <div className="h-3 w-16 animate-pulse rounded bg-[#f5f3f0]" />

          {/* Title (two lines) */}
          <div className="space-y-2">
            <div className="h-9 w-3/4 animate-pulse rounded bg-[#f5f3f0]" />
            <div className="h-9 w-1/2 animate-pulse rounded bg-[#f5f3f0]" />
          </div>

          {/* Star rating */}
          <div className="h-5 w-32 animate-pulse rounded bg-[#f5f3f0]" />

          {/* Price */}
          <div className="h-8 w-24 animate-pulse rounded bg-[#f5f3f0]" />

          {/* Description (3 lines) */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-[#f5f3f0]" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-[#f5f3f0]" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-[#f5f3f0]" />
          </div>

          {/* Feature lines (5 items) */}
          <div className="space-y-2.5 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-[#f5f3f0]"
                style={{ width: `${60 + ((i * 7) % 25)}%` }}
              />
            ))}
          </div>

          {/* Add to Cart area: quantity selector + button + heart */}
          <div className="flex gap-3 pt-4">
            <div className="h-11 w-32 animate-pulse rounded-md bg-[#f5f3f0]" />
            <div className="h-11 flex-1 animate-pulse rounded-md bg-[#f5f3f0]" />
            <div className="h-11 w-11 animate-pulse rounded-md bg-[#f5f3f0]" />
          </div>

          {/* Shipping info bar */}
          <div className="h-12 w-full animate-pulse rounded-lg bg-[#f5f3f0]" />
        </div>
      </div>

      {/* ── Why you&apos;ll love it skeleton ────────────────────── */}
      <div className="mt-16 border-t border-[#e1dcd0]/50 pt-16">
        <div className="mx-auto h-8 w-48 animate-pulse rounded bg-[#f5f3f0]" />
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-[#f5f3f0]" />
              <div className="h-5 w-36 animate-pulse rounded bg-[#f5f3f0]" />
              <div className="h-4 w-44 animate-pulse rounded bg-[#f5f3f0]" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Reviews skeleton ─────────────────────────────────── */}
      <div className="mt-16 border-t border-[#e1dcd0]/50 pt-16">
        <div className="h-7 w-48 animate-pulse rounded bg-[#f5f3f0]" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-[#e1dcd0] p-5 space-y-3"
            >
              {/* Author row */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-[#f5f3f0]" />
                <div className="space-y-1.5">
                  <div className="h-4 w-20 animate-pulse rounded bg-[#f5f3f0]" />
                  <div className="h-3 w-16 animate-pulse rounded bg-[#f5f3f0]" />
                </div>
              </div>

              {/* Stars */}
              <div className="h-4 w-24 animate-pulse rounded bg-[#f5f3f0]" />

              {/* Review title */}
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#f5f3f0]" />

              {/* Review body (3 lines) */}
              <div className="space-y-1.5">
                <div className="h-4 w-full animate-pulse rounded bg-[#f5f3f0]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[#f5f3f0]" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-[#f5f3f0]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Related products skeleton ────────────────────────── */}
      <div className="mt-16 border-t border-[#e1dcd0]/50 pt-16">
        <div className="h-7 w-48 animate-pulse rounded bg-[#f5f3f0]" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              {/* Image placeholder */}
              <div className="aspect-[4/5] animate-pulse rounded-lg bg-[#f5f3f0]" />
              {/* Text placeholders */}
              <div className="mt-3 space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-[#f5f3f0]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#f5f3f0]" />
                <div className="h-4 w-16 animate-pulse rounded bg-[#f5f3f0]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
