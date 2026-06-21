import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/common/utils/cn";

type ButtonVariant = "primary";
type ButtonSize = "md" | "lg";

type ButtonStyleOptions = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
};

const buttonVariantClassNames: Record<ButtonVariant, string> = {
    primary:
        "bg-primary-container text-on-primary shadow-primary-action hover:bg-primary-container-hover focus:ring-primary-fixed-dim disabled:cursor-not-allowed disabled:bg-primary-container-disabled",
};

const buttonSizeClassNames: Record<ButtonSize, string> = {
    md: "px-3 py-3",
    lg: "px-3 py-3",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleOptions;

export type ButtonLinkProps = LinkProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
    ButtonStyleOptions;

export function buttonClassNames({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
}: ButtonStyleOptions = {}) {
    return cn(
        "inline-flex items-center justify-center rounded-control font-semibold text-sm transition focus:outline-none focus:ring-4",
        buttonVariantClassNames[variant],
        buttonSizeClassNames[size],
        fullWidth && "w-full",
        className,
    );
}

export function Button({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            className={buttonClassNames({ variant, size, fullWidth, className })}
            type={type}
            {...props}
        />
    );
}

export function ButtonLink({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    ...props
}: ButtonLinkProps) {
    return (
        <Link className={buttonClassNames({ variant, size, fullWidth, className })} {...props} />
    );
}
