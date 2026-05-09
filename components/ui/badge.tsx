import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest shadow-inner-soft transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
  {
    variants: {
      variant: {
        default: "border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-teal-500/15 text-cyan-100",
        emergency:
          "border-red-400/40 bg-gradient-to-r from-red-950/80 to-red-900/50 text-red-100 shadow-[0_0_20px_-6px_rgba(239,68,68,0.45)]",
        clinic:
          "border-amber-400/35 bg-gradient-to-r from-amber-950/70 to-amber-900/40 text-amber-100 shadow-[0_0_16px_-6px_rgba(245,158,11,0.25)]",
        muted: "border-white/10 bg-white/[0.06] text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
