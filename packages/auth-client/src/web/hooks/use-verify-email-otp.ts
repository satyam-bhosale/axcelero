import { type ErrorContext } from "better-auth/react";
import { useReducer } from "react";
import { type WebAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";
import { handleRateLimit } from "../../utils/hand-rate-limit";

type VerifyEmailOtpFn = WebAuthClient["emailOtp"]["verifyEmail"];
type VerifyEmailOtpParameters = Parameters<VerifyEmailOtpFn>[0];
type VerifyEmailOtpData = InferData<VerifyEmailOtpFn>;
type VerifyEmailOtpError = (NonNullable<InferError<VerifyEmailOtpFn>> & RetryAfter) | null;
type VerifyEmailOtpResult = Promise<{ data: VerifyEmailOtpData, error: VerifyEmailOtpError }>;

type VerifyEmailOtpMutationState = {
    status: MutationStatus;
    data: VerifyEmailOtpData;
    error: VerifyEmailOtpError;
}

type VerifyEmailOtpAction =
    { type: 'START' } |
    { type: 'SUCCESS', payload: VerifyEmailOtpData } |
    { type: 'ERROR', payload: VerifyEmailOtpError };

type HookReturnType = {
    verifyEmailOtp: (args: VerifyEmailOtpParameters) => VerifyEmailOtpResult;
    data: VerifyEmailOtpData,
    error: VerifyEmailOtpError,
    status: {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
    }
}

function reducer(state: VerifyEmailOtpMutationState, action: VerifyEmailOtpAction): VerifyEmailOtpMutationState {
    switch (action.type) {
        case "START":
            return {
                status: 'pending',
                data: null,
                error: null
            };
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

const initialState: VerifyEmailOtpMutationState = {
    status: 'idle',
    data: null,
    error: null
}

export function useVerifyEmailOtp(client: WebAuthClient) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function verifyEmailOtp(args: VerifyEmailOtpParameters): VerifyEmailOtpResult {
        let retryAfter = 0;
        dispatch({ type: "START" });

        const result = await client.emailOtp.verifyEmail({
            ...args,
        }, {
            onError: (ctx: ErrorContext) => {
                const { retryAfter: rawRetryAfter } = handleRateLimit(ctx);
                retryAfter = rawRetryAfter;
            }
        });

        if (result.error) {
            dispatch({ type: 'ERROR', payload: { ...result.error, retryAfter } });
            return { data: null, error: { ...result.error, retryAfter } };
        }

        dispatch({ type: "SUCCESS", payload: result.data });
        return result;

    }

    const returnValues: HookReturnType = {
        verifyEmailOtp,
        data: state.data,
        error: state.error,
        status: {
            isIdle: state.status === 'idle',
            isPending: state.status === 'pending',
            isSuccess: state.status === 'success',
            isError: state.status === 'error',
        }
    }

    return returnValues;
}