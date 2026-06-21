import type { FlowType } from "../_types";

export function isWorkspaceAccessFlow(flow: string | undefined): flow is FlowType {
    return flow === "create" || flow === "join";
}
