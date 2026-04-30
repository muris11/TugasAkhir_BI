import { cn } from "@/lib/cn";

type InvertedSectionProps = React.HTMLAttributes<HTMLElement> & {
  glow?: boolean;
  children: React.ReactNode;
};

export function InvertedSection({ className, glow = true, children, ...props }: InvertedSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl bg-foreground text-background",
        className,
      )}
      {...props}
    >
      <div className="dot-pattern absolute inset-0 opacity-100" aria-hidden />
      {glow ? (
        <>
          <div
            aria-hidden
            className="radial-glow-accent pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full"
          />
          <div
            aria-hidden
            className="radial-glow-accent pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full opacity-70"
          />
        </>
      ) : null}
      <div className="relative">{children}</div>
    </section>
  );
}
