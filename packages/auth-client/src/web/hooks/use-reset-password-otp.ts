import { type ErrorContext } from "better-auth/react";
import { useReducer } from "react";
import { type WebAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";
import { handleRateLimit } from "../../utils/hand-rate-limit";

type ResetPasswordOtpFn = WebAuthClient["emailOtp"]["resetPassword"];
type ResetPasswordOtpParameters = Parameters<ResetPasswordOtpFn>[0];
type ResetPasswordOtpData = InferData<ResetPasswordOtpFn>;
type ResetPasswordOtpError = (NonNullable<InferError<ResetPasswordOtpFn>> & RetryAfter) | null;
type ResetPasswordOtpResult = Promise<{ data: ResetPasswordOtpData, error: ResetPasswordOtpError }>;

type ResetPasswordOtpMutationState = {
    status: MutationStatus,
    data: ResetPasswordOtpData,
    error: ResetPasswordOtpError
}

type ResetPasswordOtpAction =
    { type: 'START' } |
    { type: 'SUCCESS', payload: ResetPasswordOtpData } |
    { type: 'ERROR', payload: ResetPasswordOtpError }

type HookReturnType = {
    resetPasswordOtp: (args: ResetPasswordOtpParameters) => ResetPasswordOtpResult;
    data: ResetPasswordOtpData,
    error: ResetPasswordOtpError,
    status: {
        isIdle: boolean,
        isPending: boolean,
        isSuccess: boolean,
        isError: boolean,
    }
}

function reducer(state: ResetPasswordOtpMutationState, action: ResetPasswordOtpAction): ResetPasswordOtpMutationState {
    switch (action.type) {
        case 'START':
            return {
                status: 'pending',
                data: null,
                error: null
            }
        case 'SUCCESS':
            return {
                status: 'success',
                data: action.payload,
                error: null
            }
        case 'ERROR':
            return {
                status: 'error',
                data: null,
                error: action.payload
            }
        default:
            return state;
    }
}

const initialState: ResetPasswordOtpMutationState = {
    status: 'idle',
    data: null,
    error: null
}

export function useResetPassword(client: WebAuthClient) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function resetPasswordOtp({ email, password, otp }: ResetPasswordOtpParameters) {
        let retryAfter = 0;

        dispatch({ type: 'START' });

        const result = await client.emailOtp.resetPassword({
            email,
            password,
            otp
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
        resetPasswordOtp,
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