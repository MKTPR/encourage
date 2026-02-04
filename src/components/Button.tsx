import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonBaseProps {
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
}

interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  disabled?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-full px-5 py-2 text-sm transition-colors inline-block text-center";
  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "border border-zinc-300 hover:bg-zinc-50",
  };

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const { disabled, ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
