import { apiClient } from '@/common/api/client';
import type {
    CompleteWorkspaceAccessVerificationRequest,
    ResendWorkspaceAccessVerificationRequest,
    SendCreateWorkspaceVerificationRequest,
    SendJoinWorkspaceVerificationRequest,
    VerificationLinkResponse,
    WorkspaceAccessVerificationResponse,
} from '../_types';

const workspaceAccessEndpoints = {
    createVerification: 'api/workspace-creation',
    joinVerification: 'api/workspace-membership',
    resendVerification: 'api/workspace-verifications/resend',
    completeCreateVerification: 'api/workspace-creation-verifications',
    completeJoinVerification: 'api/workspace-membership-verifications',
};

export async function sendCreateWorkspaceVerification(
    request: SendCreateWorkspaceVerificationRequest,
): Promise<VerificationLinkResponse> {
    const response = await apiClient.post<VerificationLinkResponse>(
        workspaceAccessEndpoints.createVerification,
        request,
    );

    return response.data;
}

export async function sendJoinWorkspaceVerification(
    request: SendJoinWorkspaceVerificationRequest,
): Promise<VerificationLinkResponse> {
    const response = await apiClient.post<VerificationLinkResponse>(workspaceAccessEndpoints.joinVerification, request);

    return response.data;
}

export async function resendWorkspaceAccessVerification(
    request: ResendWorkspaceAccessVerificationRequest,
): Promise<VerificationLinkResponse> {
    const response = await apiClient.post<VerificationLinkResponse>(
        workspaceAccessEndpoints.resendVerification,
        request,
    );

    return response.data;
}

export async function completeCreateWorkspaceVerification(
    request: CompleteWorkspaceAccessVerificationRequest,
): Promise<WorkspaceAccessVerificationResponse> {
    const response = await apiClient.post<WorkspaceAccessVerificationResponse>(
        workspaceAccessEndpoints.completeCreateVerification,
        request,
    );

    return response.data;
}

export async function completeJoinWorkspaceVerification(
    request: CompleteWorkspaceAccessVerificationRequest,
): Promise<WorkspaceAccessVerificationResponse> {
    const response = await apiClient.post<WorkspaceAccessVerificationResponse>(
        workspaceAccessEndpoints.completeJoinVerification,
        request,
    );

    return response.data;
}
