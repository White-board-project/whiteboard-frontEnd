import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/common/api/error';
import { WorkspaceAccessContainer } from './WorkspaceAccessContainer';

const navigationMocks = vi.hoisted(() => ({
    push: vi.fn(),
}));

const apiMocks = vi.hoisted(() => ({
    sendCreateWorkspaceVerification: vi.fn(),
    sendJoinWorkspaceVerification: vi.fn(),
    resendWorkspaceAccessVerification: vi.fn(),
    completeCreateWorkspaceVerification: vi.fn(),
    completeJoinWorkspaceVerification: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: navigationMocks.push,
    }),
}));

vi.mock('../../_api', () => apiMocks);

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

describe('WorkspaceAccessContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        apiMocks.sendCreateWorkspaceVerification.mockResolvedValue({});
        apiMocks.sendJoinWorkspaceVerification.mockResolvedValue({});
    });

    it('renders create and join forms', () => {
        renderWithQueryClient(<WorkspaceAccessContainer />);

        expect(screen.getByRole('heading', { name: '새 워크스페이스 만들기' })).toBeVisible();
        expect(screen.getByRole('heading', { name: '초대 코드로 참여하기' })).toBeVisible();
        expect(screen.getAllByLabelText('이메일 주소')).toHaveLength(2);
    });

    it('shows required validation messages before create API request', async () => {
        const user = userEvent.setup();
        renderWithQueryClient(<WorkspaceAccessContainer />);

        await user.click(screen.getByRole('button', { name: '워크스페이스 생성 링크 받기' }));

        expect(await screen.findByText('워크스페이스 이름을 입력해 주세요.')).toBeVisible();
        expect(screen.getByText('이메일 주소를 입력해 주세요.')).toBeVisible();
        expect(apiMocks.sendCreateWorkspaceVerification).not.toHaveBeenCalled();
    });

    it('sends create verification link and moves to pending page', async () => {
        const user = userEvent.setup();
        renderWithQueryClient(<WorkspaceAccessContainer />);

        await user.type(screen.getByLabelText('워크스페이스 이름'), '디자인 프로젝트');
        await user.type(screen.getAllByLabelText('이메일 주소')[0], 'designer@example.com');
        await user.click(screen.getByRole('button', { name: '워크스페이스 생성 링크 받기' }));

        await waitFor(() => {
            expect(apiMocks.sendCreateWorkspaceVerification).toHaveBeenCalledWith(
                {
                    workspaceName: '디자인 프로젝트',
                    email: 'designer@example.com',
                },
                expect.any(Object),
            );
        });
        expect(navigationMocks.push).toHaveBeenCalledWith(
            '/workspace-access/verification-pending?flow=create&email=designer%40example.com&workspaceName=%EB%94%94%EC%9E%90%EC%9D%B8+%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8',
        );
    });

    it('shows workspace limit message for create API limit errors', async () => {
        const user = userEvent.setup();
        apiMocks.sendCreateWorkspaceVerification.mockRejectedValue(
            new ApiError({
                message: 'limit exceeded',
                kind: 'http',
                status: 409,
                code: 'WORKSPACE_LIMIT_EXCEEDED',
            }),
        );
        renderWithQueryClient(<WorkspaceAccessContainer />);

        await user.type(screen.getByLabelText('워크스페이스 이름'), '디자인 프로젝트');
        await user.type(screen.getAllByLabelText('이메일 주소')[0], 'designer@example.com');
        await user.click(screen.getByRole('button', { name: '워크스페이스 생성 링크 받기' }));

        expect(await screen.findByText('워크스페이스는 사용자당 최대 3개까지 생성할 수 있습니다.')).toBeVisible();
    });

    it('sends join verification link and moves to pending page', async () => {
        const user = userEvent.setup();
        renderWithQueryClient(<WorkspaceAccessContainer />);

        await user.type(screen.getByLabelText('초대 코드'), 'ABC-123');
        await user.type(screen.getAllByLabelText('이메일 주소')[1], 'member@example.com');
        await user.click(screen.getByRole('button', { name: '워크스페이스 참여하기' }));

        await waitFor(() => {
            expect(apiMocks.sendJoinWorkspaceVerification).toHaveBeenCalledWith(
                {
                    invite: 'ABC-123',
                    email: 'member@example.com',
                },
                expect.any(Object),
            );
        });
        expect(navigationMocks.push).toHaveBeenCalledWith(
            '/workspace-access/verification-pending?flow=join&email=member%40example.com&invite=ABC-123',
        );
    });
});
