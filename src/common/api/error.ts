import axios from 'axios';

export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'cancelled' | 'unknown';

export class ApiError extends Error {
    readonly kind: ApiErrorKind;
    readonly status?: number;
    readonly code?: string;
    readonly payload?: unknown;

    constructor(params: {
        message: string;
        kind: ApiErrorKind;
        status?: number;
        code?: string;
        payload?: unknown;
        cause?: unknown;
    }) {
        super(params.message, { cause: params.cause });
        this.name = 'ApiError';
        this.kind = params.kind;
        this.status = params.status;
        this.code = params.code;
        this.payload = params.payload;
    }
}

export function isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
}

export function normalizeApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const payload = error.response?.data;

        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            return new ApiError({
                message: '요청 시간이 초과되었습니다.',
                kind: 'timeout',
                status,
                code: error.code,
                payload,
                cause: error,
            });
        }

        if (error.code === 'ERR_CANCELED') {
            return new ApiError({
                message: '요청이 취소되었습니다.',
                kind: 'cancelled',
                status,
                code: error.code,
                payload,
                cause: error,
            });
        }

        if (!error.response) {
            return new ApiError({
                message: '네트워크 연결을 확인해주세요.',
                kind: 'network',
                code: error.code,
                cause: error,
            });
        }

        return new ApiError({
            message: extractErrorMessage(payload) ?? '요청 처리 중 오류가 발생했습니다.',
            kind: 'http',
            status,
            code: error.code,
            payload,
            cause: error,
        });
    }

    if (error instanceof Error) {
        return new ApiError({
            message: error.message,
            kind: 'unknown',
            cause: error,
        });
    }

    return new ApiError({
        message: '알 수 없는 오류가 발생했습니다.',
        kind: 'unknown',
        payload: error,
    });
}

function extractErrorMessage(payload: unknown): string | undefined {
    if (
        typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof payload.message === 'string'
    ) {
        return payload.message;
    }

    return undefined;
}
