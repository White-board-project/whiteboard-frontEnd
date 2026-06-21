import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/common/api/error';
import { VerificationPendingPage } from './VerificationPendingPage';

const apiMocks = vi.hoisted(() => ({
    sendCreateWorkspaceVerification: vi.fn(),
    sendJoinWorkspaceVerification: vi.fn(),
    resendWorkspaceAccessVerification: vi.fn(),
    completeCreateWorkspaceVerification: vi.fn(),
    completeJoinWorkspaceVerification: vi.fn(),
}));

vi.mock('../../../_api', () => apiMocks);

function renderWithQueryClient(children: ReactNode) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
}

describe('VerificationPendingPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        apiMocks.resendWorkspaceAccessVerification.mockResolvedValue({});
    });

    it('renders pending state for create flow', () => {
        renderWithQueryClient(
            <VerificationPendingPage email="designer@example.com" flow="create" workspaceName="디자인 프로젝트" />,
        );

        expect(screen.getByRole('heading', { name: '인증 메일을 발송했습니다.' })).toBeVisible();
        expect(screen.getByText('designer@example.com')).toBeVisible();
        expect(screen.getByText('워크스페이스 생성 링크 발송 완료')).toBeVisible();
    });

    it('resends verification mail and shows status feedback', async () => {
        const user = userEvent.setup();
        renderWithQueryClient(
            <VerificationPendingPage email="designer@example.com" flow="create" workspaceName="디자인 프로젝트" />,
        );

        await user.click(screen.getByRole('button', { name: '메일 다시 보내기' }));

        expect(await screen.findByRole('status')).toHaveTextContent('인증 메일이 성공적으로 재전송되었습니다!');
        expect(apiMocks.resendWorkspaceAccessVerification).toHaveBeenCalledWith(
            {
                flow: 'create',
                email: 'designer@example.com',
                workspaceName: '디자인 프로젝트',
                invite: undefined,
            },
            expect.any(Object),
        );
    });

    it('shows API error feedback for resend failure', async () => {
        const user = userEvent.setup();
        apiMocks.resendWorkspaceAccessVerification.mockRejectedValue(
            new ApiError({
                message: '네트워크 연결을 확인해주세요.',
                kind: 'network',
            }),
        );
        renderWithQueryClient(<VerificationPendingPage email="member@example.com" flow="join" invite="ABC-123" />);

        await user.click(screen.getByRole('button', { name: '메일 다시 보내기' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('네트워크 연결을 확인해주세요.');
    });
});
