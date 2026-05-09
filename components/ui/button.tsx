import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-cyan-400/30 bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 text-slate-950 shadow-glow-sm hover:border-cyan-300/50 hover:from-cyan-300 hover:via-cyan-400 hover:to-teal-500 hover:shadow-glow",
        secondary:
          "border border-white/[0.12] bg-white/[0.06] text-slate-100 shadow-inner-soft backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.1]",
        ghost: "border border-transparent text-slate-200 hover:border-white/10 hover:bg-white/[0.06]",
        destructive:
          "border border-red-500/30 bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_0_24px_-4px_rgba(239,68,68,0.4)] hover:from-red-400 hover:to-red-600",
      },
      size: {
        default: "min-h-11 px-5 py-2.5 md:min-h-10 md:px-4 md:py-2",
        sm: "min-h-11 rounded-lg px-3.5 text-xs md:min-h-9",
        lg: "min-h-12 rounded-xl px-8 py-3.5 text-base md:min-h-11",
        icon: "min-h-11 min-w-11 rounded-xl md:min-h-10 md:min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
