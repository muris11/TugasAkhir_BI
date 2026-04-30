declare module "react-katex" {
  import type { ReactNode } from "react";

  type KatexProps = {
    math: string;
    children?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    settings?: Record<string, unknown>;
  };

  export const InlineMath: React.FC<KatexProps>;
  export const BlockMath: React.FC<KatexProps>;
}
