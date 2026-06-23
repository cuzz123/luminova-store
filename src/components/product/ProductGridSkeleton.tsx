import { cn } from "@/lib/utils";

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export default function ProductGridSkeleton({
  count = 6,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] w-full rounded-lg bg-[#f5f3f0]" />
          <div className="mt-3 h-3 w-16 rounded bg-[#f5f3f0]" />
          <div className="mt-2 h-4 w-3/4 rounded bg-[#f5f3f0]" />
          <div className="mt-2 h-4 w-1/3 rounded bg-[#f5f3f0]" />
        </div>
      ))}
    </div>
  );
}
