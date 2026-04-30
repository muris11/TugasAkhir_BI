"use client";

import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import { cn } from "@/lib/cn";

export function MathInline({ children, className }: { children: string; className?: string }) {
  try {
    return (
      <span className={cn("font-mono-ui text-[0.95em]", className)}>
        <InlineMath math={children} />
      </span>
    );
  } catch {
    return <code className={cn("font-mono-ui text-[0.9em]", className)}>{children}</code>;
  }
}

export function MathBlock({ children, className }: { children: string; className?: string }) {
  try {
    return (
      <div className={cn("dash-scroll my-3 overflow-x-auto rounded-xl border border-border bg-muted/40 px-4 py-3", className)}>
        <BlockMath math={children} />
      </div>
    );
  } catch {
    return (
      <pre className={cn("my-3 overflow-x-auto rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs", className)}>
        <code>{children}</code>
      </pre>
    );
  }
}
