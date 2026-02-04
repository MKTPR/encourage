import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "solid" | "dashed";
  className?: string;
}

export function Card({ children, variant = "solid", className = "" }: CardProps) {
  const baseStyles = "rounded-lg p-6";

  const variantStyles = {
    solid: "border border-border bg-card",
    dashed: "border border-dashed border-border",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
