import { Button, Text } from "@/common/components/ui";
import type { ActionCardProps } from "../../_types";
import { WorkspaceIcon } from "../icon";

export function ActionCard({
    badge,
    title,
    description,
    submitLabel,
    submittingLabel,
    children,
    isSubmitting,
    isSubmitDisabled = false,
    errorMessage,
    onSubmit,
}: ActionCardProps) {
    return (
        <form
            aria-busy={isSubmitting}
            className="rounded-3xl border border-outline-variant bg-white/90 p-6 text-left shadow-card backdrop-blur sm:p-8"
            noValidate
            onSubmit={onSubmit}
        >
            <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                    <Text
                        as="span"
                        className="rounded-full bg-primary-fixed px-3 py-1"
                        tone="primaryStrong"
                        variant="tag-xs"
                    >
                        {badge}
                    </Text>
                    <Text as="h2" className="mt-4" variant="h2">
                        {title}
                    </Text>
                    <Text className="mt-2" tone="muted" variant="body-md">
                        {description}
                    </Text>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface-container-low text-primary-container">
                    <WorkspaceIcon />
                </div>
            </div>

            <div className="space-y-4">{children}</div>

            <Button
                className="mt-7"
                disabled={isSubmitting || isSubmitDisabled}
                fullWidth
                type="submit"
            >
                {isSubmitting ? submittingLabel : submitLabel}
            </Button>
            {errorMessage ? (
                <Text
                    className="mt-4 rounded-control bg-error-container-soft px-4 py-3"
                    role="alert"
                    tone="error"
                    variant="body-md"
                >
                    {errorMessage}
                </Text>
            ) : null}
        </form>
    );
}
