export const workspaceAccessKeys = {
    all: ["workspace-access"] as const,
    createVerification: () => [...workspaceAccessKeys.all, "create-verification"] as const,
    joinVerification: () => [...workspaceAccessKeys.all, "join-verification"] as const,
    resendVerification: () => [...workspaceAccessKeys.all, "resend-verification"] as const,
};
