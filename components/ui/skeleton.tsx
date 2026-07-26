import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass rounded-3xl p-5", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="mt-5 h-8 w-2/3" />
      <Skeleton className="mt-3 h-3 w-full" />
    </div>
  );
}
