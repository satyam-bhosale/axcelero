import { type ErrorContext } from "better-auth/react";
import { useReducer } from "react";
import { type WebAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";
import { handleRateLimit } from "../../utils/hand-rate-limit";

type RequestPasswordResetFn = WebAuthClient["emailOtp"]["requestPasswordReset"];
type RequestPasswordResetParameters = Parameters<RequestPasswordResetFn>[0];
type RequestPasswordResetData = InferData<RequestPasswordResetFn>;
type RequestPasswordResetError = (NonNullable<InferError<RequestPasswordResetFn>> & RetryAfter) | null;
type RequestPasswordResetResult = Promise<{ data: RequestPasswordResetData, error: RequestPasswordResetError }>;

type RequestPasswordResetMutationState = {
    status: MutationStatus,
    data: RequestPasswordResetData,
    error: RequestPasswordResetError
}

type RequesPasswordResetAction =
    { type: "START" } |
    { type: "SUCCESS", payload: RequestPasswordResetData } |
    { type: "ERROR", payload: RequestPasswordResetError }

type HookReturnType = {
    requestPasswordReset: (args: RequestPasswordResetParameters) => RequestPasswordResetResult;
    data: RequestPasswordResetData,
    error: RequestPasswordResetError,
    status: {
        isIdle: boolean,
        isPending: boolean,
        isSuccess: boolean,
        isError: boolean
    }
}

function reducer(state: RequestPasswordResetMutationState, action: RequesPasswordResetAction): RequestPasswordResetMutationState {
    switch (action.type) {
        case "START":
            return {
                status: 'pending',
                data: null,
                error: null
            }
        case "SUCCESS":
            return {
                status: 'success',
                data: action.payload,
                error: null
            }
        case "ERROR":
            return {
                status: 'error',
                data: null,
                error: action.payload
            }
        default:
            return state;
    }
}

const initialState: RequestPasswordResetMutationState = {
    status: 'idle',
    data: null,
    error: null
}

export function useRequestPasswordReset(client: WebAuthClient) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function requestPasswordReset({ email }: RequestPasswordResetParameters) {
        let retryAfter = 0;

        dispatch({ type: 'START' });
        const result = await client.emailOtp.requestPasswordReset({
            email
        }, {
            onError: (ctx : ErrorContext) => {
                const { retryAfter: rawRetryAfter } = handleRateLimit(ctx);
                retryAfter = rawRetryAfter;
            }
        });

        if (result.error) {
            dispatch({ type: 'ERROR', payload: { ...result.error, retryAfter } });

            return { data: result.data, error: { ...result.error, retryAfter } };
        }

        dispatch({ type: 'SUCCESS', payload: result.data });
        return result;
    }

    const result: HookReturnType = {
        requestPasswordReset,
        data: state.data,
        error: state.error,
        status: {
            isIdle: state.status === 'idle',
            isPending: state.status === 'pending',
            isSuccess: state.status === 'success',
            isError: state.status === 'error'
        }
    }

    return result;
}