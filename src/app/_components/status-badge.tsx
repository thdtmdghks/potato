import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("rounded-full text-xs font-semibold", {
  variants: {
    color: {
      amber:
        "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",
      sky: "border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/30 dark:text-sky-400",
      emerald:
        "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400",
      indigo:
        "border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400",
    },
    size: {
      sm: "px-2 py-0.5",
      md: "border px-2.5 py-1",
    },
  },
  defaultVariants: {
    color: "amber",
    size: "md",
  },
});

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ color, size, children, className }: StatusBadgeProps) {
  return <span className={cn(badgeVariants({ color, size }), className)}>{children}</span>;
}
