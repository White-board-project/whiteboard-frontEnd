import { isApiError } from "@/common/api/error";

const workspaceLimitMessage = "워크스페이스는 사용자당 최대 3개까지 생성할 수 있습니다.";
const fallbackMessage = "요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export function getWorkspaceAccessErrorMessage(error: unknown): string {
    if (!isApiError(error)) {
        return fallbackMessage;
    }

    if (isWorkspaceLimitError(error.code) || isWorkspaceLimitPayload(error.payload)) {
        return workspaceLimitMessage;
    }

    return error.message || fallbackMessage;
}

function isWorkspaceLimitError(code: string | undefined): boolean {
    return code === "WORKSPACE_LIMIT_EXCEEDED" || code === "MAX_WORKSPACE_LIMIT_EXCEEDED";
}

function isWorkspaceLimitPayload(payload: unknown): boolean {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }

    if (!("code" in payload) || typeof payload.code !== "string") {
        return false;
    }

    return isWorkspaceLimitError(payload.code);
}
