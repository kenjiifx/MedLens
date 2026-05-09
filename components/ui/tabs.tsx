import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex min-h-11 w-full flex-wrap items-center justify-center gap-1 rounded-xl border border-white/[0.08] bg-slate-950/70 p-1.5 text-slate-300 shadow-inner backdrop-blur-sm sm:h-10 sm:flex-nowrap sm:p-1",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex min-h-11 flex-1 items-center justify-center whitespace-normal rounded-lg px-2 py-2 text-center text-xs font-semibold leading-tight tracking-wide ring-offset-slate-950 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/45 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:border data-[state=active]:border-cyan-500/35 data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500/20 data-[state=active]:to-teal-600/15 data-[state=active]:text-cyan-50 data-[state=active]:shadow-glow-sm",
      "data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:bg-white/[0.05] data-[state=inactive]:hover:text-slate-300",
      "sm:min-h-0 sm:flex-initial sm:whitespace-nowrap sm:px-3 sm:py-1.5 sm:text-sm",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-4 ring-offset-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
