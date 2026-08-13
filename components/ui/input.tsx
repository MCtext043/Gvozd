import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label ? (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--gvozd-graphite)]">
            {label}
            {props.required ? <span className="text-[var(--gvozd-red)]"> *</span> : null}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-md border border-[var(--gvozd-gray-300)] bg-white px-3 py-2 text-sm text-[var(--gvozd-black)] placeholder:text-[var(--gvozd-gray-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gvozd-red)] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-[var(--gvozd-red)]",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {hint && !error ? (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--gvozd-gray-500)]">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-[var(--gvozd-red)]" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
