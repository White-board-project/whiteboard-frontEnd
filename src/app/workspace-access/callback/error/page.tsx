import { ButtonLink, Text } from '@/common/components/ui';
import { Atmosphere, BrandMark } from '../../_components';

type WorkspaceAccessCallbackErrorPageProps = {
    searchParams: Promise<{
        message?: string;
    }>;
};

export default async function WorkspaceAccessCallbackErrorPage({
    searchParams,
}: WorkspaceAccessCallbackErrorPageProps) {
    const { message } = await searchParams;

    return (
        <main className="relative min-h-screen overflow-hidden bg-surface px-5 py-8 font-sans text-on-surface sm:px-8 lg:px-12">
            <Atmosphere />
            <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col">
                <header className="flex justify-start pt-2">
                    <BrandMark alignment="left" />
                </header>
                <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center py-16 text-center">
                    <Text
                        className="mb-3 rounded-full bg-error-container-soft px-4 py-2 tracking-[0.15em]"
                        tone="error"
                        variant="tag-xs"
                    >
                        Verification failed
                    </Text>
                    <Text as="h1" variant="h1">
                        인증 링크를 확인할 수 없습니다.
                    </Text>
                    <Text className="mt-5" tone="muted" variant="body-lg">
                        {message ?? '인증 링크가 만료되었거나 올바르지 않습니다.'} 다시 인증 메일을 요청하거나 고객
                        지원에 문의해 주세요.
                    </Text>
                    <ButtonLink className="mt-9" href="/workspace-access" size="lg">
                        인증 메일 다시 요청하기
                    </ButtonLink>
                </section>
            </div>
        </main>
    );
}
