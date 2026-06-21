import type { FieldError, UseFormRegister } from 'react-hook-form';
import { Text } from '@/common/components/ui';
import type { CreateWorkspaceFormValues, JoinWorkspaceFormValues } from '../../_schemas';
import type { WorkspaceAccessSubmitHandler } from '../../_types';
import { BrandMark, Footer } from '../brand';
import { ActionCard, Field } from '../form';

type WorkspaceAccessPageProps = {
    createForm: {
        register: UseFormRegister<CreateWorkspaceFormValues>;
        errors: Partial<Record<keyof CreateWorkspaceFormValues, FieldError>>;
        isSubmitting: boolean;
        isSubmitDisabled?: boolean;
        errorMessage?: string;
        onSubmit: WorkspaceAccessSubmitHandler;
    };
    joinForm: {
        register: UseFormRegister<JoinWorkspaceFormValues>;
        errors: Partial<Record<keyof JoinWorkspaceFormValues, FieldError>>;
        isSubmitting: boolean;
        isSubmitDisabled?: boolean;
        errorMessage?: string;
        onSubmit: WorkspaceAccessSubmitHandler;
    };
};

export function WorkspaceAccessPage({ createForm, joinForm }: WorkspaceAccessPageProps) {
    const isCreateDisabled = createForm.isSubmitting || createForm.isSubmitDisabled;
    const isJoinDisabled = joinForm.isSubmitting || joinForm.isSubmitDisabled;

    return (
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col">
            <header className="flex justify-center pt-2">
                <BrandMark alignment="center" />
            </header>

            <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 py-14">
                <div className="max-w-2xl text-center">
                    <Text className="mb-3 tracking-[0.18em]" tone="primary" variant="tag-xs">
                        Passwordless workspace
                    </Text>
                    <Text as="h1" variant="h1">
                        화이트보드에서 협업을 시작하세요
                    </Text>
                    <Text className="mt-4" tone="muted" variant="body-lg">
                        새 워크스페이스를 만들거나 초대 코드로 참여하고, 이메일 매직 링크로 안전하게 로그인하세요.
                    </Text>
                </div>

                <div className="grid w-full gap-6 lg:grid-cols-2">
                    <ActionCard
                        badge="Create"
                        title="새 워크스페이스 만들기"
                        description="프로젝트 이름과 이메일을 입력하면 워크스페이스 생성 링크를 보내드립니다."
                        submitLabel="워크스페이스 생성 링크 받기"
                        submittingLabel="생성 링크를 보내는 중입니다"
                        isSubmitting={createForm.isSubmitting}
                        isSubmitDisabled={createForm.isSubmitDisabled}
                        errorMessage={createForm.errorMessage}
                        onSubmit={createForm.onSubmit}
                    >
                        <Field
                            autoComplete="organization"
                            disabled={isCreateDisabled}
                            error={createForm.errors.workspaceName}
                            id="workspace-name"
                            label="워크스페이스 이름"
                            placeholder="예: 디자인 프로젝트"
                            registration={createForm.register('workspaceName')}
                            required
                        />
                        <Field
                            autoComplete="email"
                            disabled={isCreateDisabled}
                            error={createForm.errors.email}
                            id="create-email"
                            label="이메일 주소"
                            placeholder="이메일 주소 입력"
                            registration={createForm.register('email')}
                            required
                            type="email"
                        />
                    </ActionCard>

                    <ActionCard
                        badge="Join"
                        title="초대 코드로 참여하기"
                        description="공유받은 초대 코드와 이메일을 입력하면 참여 링크를 보내드립니다."
                        submitLabel="워크스페이스 참여하기"
                        submittingLabel="참여 링크를 보내는 중입니다"
                        isSubmitting={joinForm.isSubmitting}
                        isSubmitDisabled={joinForm.isSubmitDisabled}
                        errorMessage={joinForm.errorMessage}
                        onSubmit={joinForm.onSubmit}
                    >
                        <Field
                            autoComplete="off"
                            disabled={isJoinDisabled}
                            error={joinForm.errors.invite}
                            id="invite"
                            label="초대 코드"
                            placeholder="초대 코드 입력"
                            registration={joinForm.register('invite')}
                            required
                        />
                        <Field
                            autoComplete="email"
                            disabled={isJoinDisabled}
                            error={joinForm.errors.email}
                            id="email"
                            label="이메일 주소"
                            placeholder="이메일 주소 입력"
                            registration={joinForm.register('email')}
                            required
                            type="email"
                        />
                    </ActionCard>
                </div>

                <Text
                    className="rounded-full border border-outline-variant bg-white/80 px-5 py-3 shadow-soft backdrop-blur"
                    tone="muted"
                    variant="body-md"
                >
                    비밀번호 없는 로그인을 위해 이메일로 매직 링크를 보내드립니다.
                </Text>
            </section>

            <Footer />
        </div>
    );
}
