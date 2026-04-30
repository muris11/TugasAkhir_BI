import { cn } from "@/lib/cn";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
  variant?: "accent" | "inverted";
};

export function SectionLabel({ children, className, pulse, variant = "accent" }: SectionLabelProps) {
  const isInverted = variant === "inverted";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-4 py-1.5",
        isInverted
          ? "border-white/20 bg-white/5 text-white"
          : "border-accent/30 bg-accent/5 text-accent",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isInverted ? "bg-white" : "bg-accent",
          pulse && "animate-pulse-dot",
        )}
      />
      <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em]">{children}</span>
    </div>
  );
}
