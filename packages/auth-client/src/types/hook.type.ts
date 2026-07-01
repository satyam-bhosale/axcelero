export type InferData<TMethod> = TMethod extends (
    ...args: infer _Args
) => Promise<infer TResult extends { data: unknown }> ? TResult["data"] : never;

export type InferError<TMethod> = TMethod extends (
    ...args: infer _Args
) => Promise<infer TResult extends { error: unknown }> ? TResult["error"] : never;

export type RetryAfter = {
    retryAfter?: number | null;
}

export type MutationStatus = 'idle' | 'pending' | 'success' | 'error';