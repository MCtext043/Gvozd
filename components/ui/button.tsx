import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--gvozd-red)] text-white hover:bg-[var(--gvozd-red-dark)] shadow-sm",
        secondary:
          "bg-[var(--gvozd-graphite)] text-white hover:bg-black",
        outline:
          "border-2 border-[var(--gvozd-graphite)] bg-transparent text-[var(--gvozd-graphite)] hover:bg-[var(--gvozd-graphite)] hover:text-white",
        ghost:
          "bg-transparent text-[var(--gvozd-graphite)] hover:bg-[var(--gvozd-gray-100)]",
        link: "bg-transparent text-[var(--gvozd-red)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
