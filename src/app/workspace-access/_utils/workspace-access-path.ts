import type { CreateWorkspaceFormValues, JoinWorkspaceFormValues } from '../_schemas';

type VerificationPendingPathParams =
    | ({ flow: 'create' } & CreateWorkspaceFormValues)
    | ({ flow: 'join' } & JoinWorkspaceFormValues);

export function buildVerificationPendingPath(params: VerificationPendingPathParams): string {
    const searchParams = new URLSearchParams({
        flow: params.flow,
        email: params.email,
    });

    if (params.flow === 'create') {
        searchParams.set('workspaceName', params.workspaceName);
    } else {
        searchParams.set('invite', params.invite);
    }

    return `/workspace-access/verification-pending?${searchParams.toString()}`;
}

export function buildWorkspaceAccessCallbackErrorPath(message: string): string {
    const searchParams = new URLSearchParams({ message });

    return `/workspace-access/callback/error?${searchParams.toString()}`;
}
