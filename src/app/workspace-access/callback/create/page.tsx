import { redirect } from 'next/navigation';
import { completeCreateWorkspaceVerification } from '../../_api';
import { buildWorkspaceAccessCallbackErrorPath, getWorkspaceAccessErrorMessage } from '../../_utils';

type CreateWorkspaceCallbackPageProps = {
    searchParams: Promise<{
        token?: string;
    }>;
};

export default async function CreateWorkspaceCallbackPage({ searchParams }: CreateWorkspaceCallbackPageProps) {
    const { token } = await searchParams;

    if (!token) {
        redirect(buildWorkspaceAccessCallbackErrorPath('인증 토큰이 없습니다.'));
    }

    let redirectPath: string;

    try {
        const result = await completeCreateWorkspaceVerification({ token });
        redirectPath = result.workspaceUrl ?? `/workspace/${result.workspaceId}`;
    } catch (error) {
        redirectPath = buildWorkspaceAccessCallbackErrorPath(getWorkspaceAccessErrorMessage(error));
    }

    redirect(redirectPath);
}
