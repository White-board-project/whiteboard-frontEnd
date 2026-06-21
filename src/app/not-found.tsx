import { ButtonLink, Text } from "@/common/components/ui";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface p-8 text-center text-on-surface">
            <Text as="h2" variant="h2">
                페이지를 찾을 수 없습니다.
            </Text>
            <ButtonLink href="/">홈으로 이동</ButtonLink>
        </main>
    );
}
