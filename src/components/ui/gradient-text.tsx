import { cn } from "@/lib/cn";

export function GradientText({
  children,
  className,
  withUnderline,
}: {
  children: React.ReactNode;
  className?: string;
  withUnderline?: boolean;
}) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="gradient-text">{children}</span>
      {withUnderline ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-1 left-0 h-2.5 w-full rounded-sm bg-linear-to-r from-accent/25 to-accent-secondary/15 md:-bottom-2 md:h-3.5"
        />
      ) : null}
    </span>
  );
}
