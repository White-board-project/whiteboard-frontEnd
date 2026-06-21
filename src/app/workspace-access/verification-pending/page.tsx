import { redirect } from 'next/navigation';
import { isWorkspaceAccessFlow } from '../_utils';
import { VerificationPendingPage } from './_components';

type VerificationPendingRoutePageProps = {
    searchParams: Promise<{
        email?: string;
        flow?: string;
        workspaceName?: string;
        invite?: string;
    }>;
};

export default async function VerificationPendingRoutePage({ searchParams }: VerificationPendingRoutePageProps) {
    const { email, flow, workspaceName, invite } = await searchParams;

    if (!email || !isWorkspaceAccessFlow(flow)) {
        redirect('/workspace-access');
    }

    return <VerificationPendingPage email={email} flow={flow} invite={invite} workspaceName={workspaceName} />;
}
