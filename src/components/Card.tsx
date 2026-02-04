import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "solid" | "dashed";
  className?: string;
}

export function Card({ children, variant = "solid", className = "" }: CardProps) {
  const baseStyles = "rounded-lg p-6";

  const variantStyles = {
    solid: "border border-zinc-200 bg-white",
    dashed: "border border-dashed border-zinc-300",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
