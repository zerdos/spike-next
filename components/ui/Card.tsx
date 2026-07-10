import type { ElementType, ReactNode } from "react";

export function Card({
  as: Tag = "div",
  glow = true,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  glow?: boolean;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const hover = glow
    ? " motion-safe:transition motion-safe:duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-glow"
    : "";
  return (
    <Tag
      className={`rounded-2xl border border-edge bg-surface-raised p-6${hover} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
