export default function Loading() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Hero skeleton */}
      <div className="relative h-[70vh] w-full animate-pulse" style={{ background: "var(--sand)" }}>
        <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 h-4 w-32 rounded" style={{ background: "#d6cfc3" }} />
          <div className="mb-6 h-14 w-96 max-w-full rounded" style={{ background: "#d6cfc3" }} />
          <div className="mb-8 h-5 w-80 max-w-full rounded" style={{ background: "#d6cfc3" }} />
          <div className="h-12 w-44 rounded-md" style={{ background: "#d6cfc3" }} />
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-3 h-8 w-64 rounded animate-pulse" style={{ background: "var(--border)" }} />
          <div className="mx-auto h-5 w-96 max-w-full rounded animate-pulse" style={{ background: "var(--border)" }} />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="mb-4 aspect-square w-full rounded-lg"
                style={{ background: "var(--border)" }}
              />
              <div className="mb-2 h-5 w-3/4 rounded" style={{ background: "var(--border)" }} />
              <div className="h-4 w-1/2 rounded" style={{ background: "var(--border)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="animate-pulse" style={{ background: "var(--dark)" }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="mb-4 h-5 w-24 rounded" style={{ background: "#4a5652" }} />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded" style={{ background: "#4a5652" }} />
                  <div className="h-4 w-28 rounded" style={{ background: "#4a5652" }} />
                  <div className="h-4 w-20 rounded" style={{ background: "#4a5652" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
