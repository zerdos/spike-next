import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center rounded-full text-sm motion-safe:transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const variants = {
  primary:
    "bg-linear-to-r from-accent-bright to-cyan font-semibold text-on-accent shadow-glow-sm hover:shadow-glow hover:brightness-110",
  secondary:
    "border border-edge-strong font-medium text-ink hover:border-accent/50 hover:bg-accent/5",
} as const;

const sizes = {
  md: "px-6 py-3",
  sm: "px-4 py-2",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

function classes(variant: Variant, size: Size, className: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: Size }) {
  return <a className={classes(variant, size, className)} {...props} />;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={classes(variant, size, className)} {...props} />;
}
