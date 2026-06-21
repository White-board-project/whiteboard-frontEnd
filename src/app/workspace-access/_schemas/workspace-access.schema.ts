import { z } from 'zod';

const emailSchema = z
    .string()
    .trim()
    .min(1, '이메일 주소를 입력해 주세요.')
    .email('올바른 이메일 주소를 입력해 주세요.');

export const createWorkspaceFormSchema = z.object({
    workspaceName: z.string().trim().min(1, '워크스페이스 이름을 입력해 주세요.'),
    email: emailSchema,
});

export const joinWorkspaceFormSchema = z.object({
    invite: z.string().trim().min(1, '초대 코드를 입력해 주세요.'),
    email: emailSchema,
});

export type CreateWorkspaceFormValues = z.infer<typeof createWorkspaceFormSchema>;
export type JoinWorkspaceFormValues = z.infer<typeof joinWorkspaceFormSchema>;
