import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex min-h-11 w-full rounded-xl border border-white/[0.1] bg-slate-950/60 px-3.5 py-2.5 text-base text-white shadow-inner backdrop-blur-sm placeholder:text-slate-500 focus-visible:border-cyan-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50 md:min-h-10 md:py-2 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
