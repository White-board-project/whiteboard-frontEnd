import { describe, expect, it } from 'vitest';
import { createWorkspaceFormSchema, joinWorkspaceFormSchema } from '.';

describe('workspace access form schemas', () => {
    it('validates create workspace form values', () => {
        const result = createWorkspaceFormSchema.safeParse({
            workspaceName: '디자인 프로젝트',
            email: 'designer@example.com',
        });

        expect(result.success).toBe(true);
    });

    it('rejects empty create workspace fields', () => {
        const result = createWorkspaceFormSchema.safeParse({
            workspaceName: '',
            email: '',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.map((issue) => issue.message)).toContain('워크스페이스 이름을 입력해 주세요.');
            expect(result.error.issues.map((issue) => issue.message)).toContain('이메일 주소를 입력해 주세요.');
        }
    });

    it('rejects invalid join email format', () => {
        const result = joinWorkspaceFormSchema.safeParse({
            invite: 'ABC-123',
            email: 'invalid-email',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.map((issue) => issue.message)).toContain('올바른 이메일 주소를 입력해 주세요.');
        }
    });
});
