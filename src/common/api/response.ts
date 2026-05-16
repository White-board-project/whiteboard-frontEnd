export type ApiResponse<T> = {
    data: T;
    message?: string;
};

export function unwrapData<T>(response: ApiResponse<T>): T {
    return response.data;
}
