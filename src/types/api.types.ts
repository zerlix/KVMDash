
export interface ApiResponse<T = unknown> {
    status: 'success' | 'error';
    data: T;
    message?: string;
}


export interface RequestOptions {
    method?: string;
    body?: string;
    headers?: {
        [key: string]: string;
    };
}