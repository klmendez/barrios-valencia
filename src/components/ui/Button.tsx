import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function Button({ asChild, className, type = "button", ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const componentProps = asChild
    ? props
    : {
        type,
        ...props,
      };

  return (
    <Component
      className={cn(
        className,
        "group relative inline-flex items-center justify-center overflow-hidden rounded-none border border-[#152A42] px-6 py-3 text-sm font-display font-semibold uppercase tracking-[0.28em] text-[#152A42] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A1805E]",
        "bg-[#F5F4F2] disabled:cursor-not-allowed disabled:opacity-60",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-[#152A42] before:via-[#A1805E] before:to-[#F5F4F2] before:transition-transform before:duration-500 before:content-[''] before:-z-10",
        "hover:text-white hover:before:translate-x-0",
      )}
      {...componentProps}
    />
  );
}
