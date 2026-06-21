import { Text } from "@/common/components/ui";
import { cn } from "@/common/utils/cn";
import type { BrandMarkProps } from "../../_types";

export function BrandMark({ alignment }: BrandMarkProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-3 rounded-full border border-outline-variant bg-white/85 px-4 py-2 shadow-brand backdrop-blur",
                alignment === "center" && "mx-auto",
            )}
        >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-container text-on-primary shadow-primary-icon">
                <Text as="span" className="font-bold" tone="inherit" variant="body-md">
                    CF
                </Text>
            </div>
            <div className="text-left">
                <Text className="font-semibold" variant="body-md">
                    CanvasFlow
                </Text>
                <Text tone="muted" variant="label-sm">
                    화이트보드
                </Text>
            </div>
        </div>
    );
}
