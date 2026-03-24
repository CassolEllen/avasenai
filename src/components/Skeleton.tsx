const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-muted rounded-lg animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-muted via-border to-muted ${className}`} />
);

export const CardSkeleton = () => (
  <div className="bg-card rounded-lg p-4 shadow-senai space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-8 w-full" />
  </div>
);

export default Skeleton;
