import type { FormEvent, ReactNode } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

export type WorkspaceAccessView = 'workspaceAccess' | 'verificationPending';

export type FlowType = 'create' | 'join';

export type WorkspaceAccessSubmitHandler = (event: FormEvent<HTMLFormElement>) => void;

export type ActionCardProps = {
    badge: string;
    title: string;
    description: string;
    submitLabel: string;
    submittingLabel: string;
    children: ReactNode;
    isSubmitting: boolean;
    isSubmitDisabled?: boolean;
    errorMessage?: string;
    onSubmit: WorkspaceAccessSubmitHandler;
};

export type FieldProps = {
    id: string;
    label: string;
    name?: string;
    placeholder: string;
    required?: boolean;
    type?: 'email' | 'text';
    disabled?: boolean;
    autoComplete?: string;
    registration?: UseFormRegisterReturn;
    error?: FieldError;
};

export type BrandMarkProps = {
    alignment: 'center' | 'left';
};

export type SendCreateWorkspaceVerificationRequest = {
    workspaceName: string;
    email: string;
};

export type SendJoinWorkspaceVerificationRequest = {
    invite: string;
    email: string;
};

export type ResendWorkspaceAccessVerificationRequest = {
    flow: FlowType;
    email: string;
    workspaceName?: string;
    invite?: string;
};

export type CompleteWorkspaceAccessVerificationRequest = {
    token: string;
};

export type VerificationLinkResponse = {
    message?: string;
};

export type WorkspaceAccessVerificationResponse = {
    workspaceId: string;
    workspaceUrl?: string;
};

export type VerificationPendingContext = {
    flow: FlowType;
    email: string;
    workspaceName?: string;
    invite?: string;
};
