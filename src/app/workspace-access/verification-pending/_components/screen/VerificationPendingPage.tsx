'use client';

import { useState } from 'react';
import { Button, Text } from '@/common/components/ui';
import { Atmosphere, BrandMark, MailIcon } from '../../../_components';
import { useResendWorkspaceAccessVerificationMutation } from '../../../_query';
import type { FlowType } from '../../../_types';
import { getWorkspaceAccessErrorMessage } from '../../../_utils';

type VerificationPendingPageProps = {
    email: string;
    flow: FlowType;
    workspaceName?: string;
    invite?: string;
};

export function VerificationPendingPage({ email, flow, workspaceName, invite }: VerificationPendingPageProps) {
    const [toastVisible, setToastVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const resendMutation = useResendWorkspaceAccessVerificationMutation();
    const flowLabel = flow === 'create' ? '워크스페이스 생성' : '워크스페이스 참여';

    const handleResendClick = async () => {
        setToastVisible(false);
        setErrorMessage(undefined);

        try {
            await resendMutation.mutateAsync({ flow, email, workspaceName, invite });
            setToastVisible(true);
        } catch (error) {
            setErrorMessage(getWorkspaceAccessErrorMessage(error));
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-surface px-5 py-8 font-sans text-on-surface sm:px-8 lg:px-12">
            <Atmosphere />
            <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col">
                <header className="flex justify-start pt-2">
                    <BrandMark alignment="left" />
                </header>

                <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center py-16 text-center">
                    <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white shadow-mail">
                        <MailIcon />
                    </div>

                    <Text
                        className="mb-3 rounded-full bg-primary-fixed px-4 py-2 tracking-[0.15em]"
                        tone="primaryStrong"
                        variant="tag-xs"
                    >
                        {flowLabel} 링크 발송 완료
                    </Text>
                    <Text as="h1" variant="h1">
                        인증 메일을 발송했습니다.
                    </Text>
                    <Text className="mt-5" tone="muted" variant="body-lg">
                        <Text as="strong" className="font-semibold" tone="default" variant="body-lg">
                            {email}
                        </Text>{' '}
                        받은 편지함을 확인하고 인증 링크를 클릭해 주세요. 링크 인증이 완료되면 워크스페이스로 이동할 수
                        있습니다.
                    </Text>

                    <Button
                        className="mt-9"
                        disabled={resendMutation.isPending}
                        onClick={handleResendClick}
                        size="lg"
                        type="button"
                    >
                        {resendMutation.isPending ? '메일을 다시 보내는 중입니다' : '메일 다시 보내기'}
                    </Button>

                    {toastVisible ? (
                        <Text
                            className="mt-5 rounded-full border border-outline-variant bg-white px-5 py-3 font-medium shadow-status"
                            role="status"
                            tone="primaryStrong"
                            variant="body-md"
                        >
                            인증 메일이 성공적으로 재전송되었습니다!
                        </Text>
                    ) : null}

                    {errorMessage ? (
                        <Text
                            className="mt-5 rounded-full border border-error-container-border bg-error-container-soft px-5 py-3 font-medium"
                            role="alert"
                            tone="error"
                            variant="body-md"
                        >
                            {errorMessage}
                        </Text>
                    ) : null}
                </section>
            </div>
        </main>
    );
}
