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
        "button-slide",
        className,
      )}
      {...componentProps}
    />
  );
}
