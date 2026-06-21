import type { HTMLAttributes } from "react";
import { cn } from "@/common/utils/cn";

export type TextVariant = "h1" | "h2" | "h3" | "body-lg" | "body-md" | "label-sm" | "tag-xs";
export type TextTone =
    | "default"
    | "muted"
    | "primary"
    | "primaryStrong"
    | "error"
    | "fieldError"
    | "inherit";

type TextElement = "p" | "span" | "h1" | "h2" | "h3" | "strong";

export type TextProps = HTMLAttributes<HTMLElement> & {
    as?: TextElement;
    variant?: TextVariant;
    tone?: TextTone;
};

const textVariantClassNames: Record<TextVariant, string> = {
    h1: "text-h1",
    h2: "text-h2",
    h3: "text-h3",
    "body-lg": "text-body-lg",
    "body-md": "text-body-md",
    "label-sm": "text-label-sm",
    "tag-xs": "text-tag-xs uppercase",
};

const textToneClassNames: Record<TextTone, string> = {
    default: "text-on-surface",
    muted: "text-on-surface-variant",
    primary: "text-primary-container",
    primaryStrong: "text-on-primary-fixed-variant",
    error: "text-error-readable",
    fieldError: "text-field-error",
    inherit: "text-inherit",
};

function getDefaultVariant(as: TextElement): TextVariant {
    if (as === "h1") {
        return "h1";
    }

    if (as === "h2") {
        return "h2";
    }

    if (as === "h3") {
        return "h3";
    }

    return "body-md";
}

export function textClassNames({
    variant,
    tone = "default",
    className,
}: Pick<TextProps, "variant" | "tone" | "className"> = {}) {
    return cn(textVariantClassNames[variant ?? "body-md"], textToneClassNames[tone], className);
}

export function Text({
    as = "p",
    variant,
    tone = "default",
    className,
    children,
    ...props
}: TextProps) {
    const resolvedClassName = textClassNames({
        variant: variant ?? getDefaultVariant(as),
        tone,
        className,
    });

    switch (as) {
        case "h1":
            return (
                <h1 className={resolvedClassName} {...props}>
                    {children}
                </h1>
            );
        case "h2":
            return (
                <h2 className={resolvedClassName} {...props}>
                    {children}
                </h2>
            );
        case "h3":
            return (
                <h3 className={resolvedClassName} {...props}>
                    {children}
                </h3>
            );
        case "span":
            return (
                <span className={resolvedClassName} {...props}>
                    {children}
                </span>
            );
        case "strong":
            return (
                <strong className={resolvedClassName} {...props}>
                    {children}
                </strong>
            );
        default:
            return (
                <p className={resolvedClassName} {...props}>
                    {children}
                </p>
            );
    }
}
