"use client";

import { Button, Text } from "@/common/components/ui";

type ErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-8 text-center text-on-surface">
            <Text as="h2" variant="h2">
                문제가 발생했습니다.
            </Text>
            <Text className="max-w-xl" tone="muted" variant="body-md">
                {error.message}
            </Text>
            <Button onClick={reset} type="button">
                다시 시도
            </Button>
        </main>
    );
}
