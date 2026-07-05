import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const styles = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-colors hover:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-400",
} as const;

type Variant = keyof typeof styles;

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={`${styles[variant]} ${className}`} {...props} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${styles[variant]} ${className}`} {...props} />;
}
