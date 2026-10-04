import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/85",
        mono: "bg-foreground text-background hover:opacity-85",
        gradient: "bg-foreground text-background hover:bg-foreground/85",
        soft: "bg-[#262524] text-foreground hover:bg-[#393836]",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-white/20 bg-transparent text-foreground hover:bg-white/10",
        contrast: "border border-white/20 bg-transparent text-foreground hover:bg-white/10",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "font-medium hover:bg-accent hover:text-accent-foreground",
        link: "font-medium text-foreground underline-offset-4 hover:underline hover:translate-y-0",
        command:
          "w-full justify-start gap-2 rounded-full border border-border bg-card px-4 text-muted-foreground shadow-sm hover:border-foreground/30 hover:bg-accent/60",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-11 rounded-full px-5 py-3 text-[15px]",
        xl: "h-12 rounded-full px-6 py-3.5 text-base",
        pill: "h-10 rounded-full px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
