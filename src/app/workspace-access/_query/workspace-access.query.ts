import { useMutation } from "@tanstack/react-query";
import {
    resendWorkspaceAccessVerification,
    sendCreateWorkspaceVerification,
    sendJoinWorkspaceVerification,
} from "../_api";
import { workspaceAccessKeys } from "./workspace-access.keys";

export function useSendCreateWorkspaceVerificationMutation() {
    return useMutation({
        mutationKey: workspaceAccessKeys.createVerification(),
        mutationFn: sendCreateWorkspaceVerification,
    });
}

export function useSendJoinWorkspaceVerificationMutation() {
    return useMutation({
        mutationKey: workspaceAccessKeys.joinVerification(),
        mutationFn: sendJoinWorkspaceVerification,
    });
}

export function useResendWorkspaceAccessVerificationMutation() {
    return useMutation({
        mutationKey: workspaceAccessKeys.resendVerification(),
        mutationFn: resendWorkspaceAccessVerification,
    });
}
