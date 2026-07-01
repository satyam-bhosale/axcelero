import { type ErrorContext } from "better-auth/react";

export function handleRateLimit(ctx: ErrorContext) {
    const error = ctx.error
    const response = ctx.response;
    const rawRetryAfter = response.headers.get('x-retry-after');
    const retryAfter = rawRetryAfter !== null ? Number(rawRetryAfter) : 0;

    return {error, retryAfter};
}