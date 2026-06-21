'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSendCreateWorkspaceVerificationMutation, useSendJoinWorkspaceVerificationMutation } from '../../_query';
import {
    type CreateWorkspaceFormValues,
    createWorkspaceFormSchema,
    type JoinWorkspaceFormValues,
    joinWorkspaceFormSchema,
} from '../../_schemas';
import { buildVerificationPendingPath, getWorkspaceAccessErrorMessage } from '../../_utils';
import { Atmosphere } from '../visual';
import { WorkspaceAccessPage } from './WorkspaceAccessPage';

export function WorkspaceAccessContainer() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [createErrorMessage, setCreateErrorMessage] = useState<string>();
    const [joinErrorMessage, setJoinErrorMessage] = useState<string>();
    const createMutation = useSendCreateWorkspaceVerificationMutation();
    const joinMutation = useSendJoinWorkspaceVerificationMutation();
    const createForm = useForm<CreateWorkspaceFormValues>({
        resolver: zodResolver(createWorkspaceFormSchema),
        defaultValues: {
            workspaceName: '',
            email: '',
        },
    });
    const joinForm = useForm<JoinWorkspaceFormValues>({
        resolver: zodResolver(joinWorkspaceFormSchema),
        defaultValues: {
            invite: '',
            email: '',
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleCreateSubmit = createForm.handleSubmit(async (values) => {
        setCreateErrorMessage(undefined);

        try {
            await createMutation.mutateAsync(values);
            router.push(buildVerificationPendingPath({ flow: 'create', ...values }));
        } catch (error) {
            setCreateErrorMessage(getWorkspaceAccessErrorMessage(error));
        }
    });

    const handleJoinSubmit = joinForm.handleSubmit(async (values) => {
        setJoinErrorMessage(undefined);

        try {
            await joinMutation.mutateAsync(values);
            router.push(buildVerificationPendingPath({ flow: 'join', ...values }));
        } catch (error) {
            setJoinErrorMessage(getWorkspaceAccessErrorMessage(error));
        }
    });

    const isCreateSubmitting = createMutation.isPending;
    const isJoinSubmitting = joinMutation.isPending;

    return (
        <main className="relative min-h-screen overflow-hidden bg-surface px-5 py-8 font-sans text-on-surface sm:px-8 lg:px-12">
            <Atmosphere />
            <WorkspaceAccessPage
                createForm={{
                    register: createForm.register,
                    errors: createForm.formState.errors,
                    isSubmitting: isCreateSubmitting,
                    isSubmitDisabled: !isMounted,
                    errorMessage: createErrorMessage,
                    onSubmit: handleCreateSubmit,
                }}
                joinForm={{
                    register: joinForm.register,
                    errors: joinForm.formState.errors,
                    isSubmitting: isJoinSubmitting,
                    isSubmitDisabled: !isMounted,
                    errorMessage: joinErrorMessage,
                    onSubmit: handleJoinSubmit,
                }}
            />
        </main>
    );
}
