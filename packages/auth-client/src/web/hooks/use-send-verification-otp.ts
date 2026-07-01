import { type ErrorContext } from "better-auth/react";
import { useReducer } from "react";
import { type WebAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";
import { handleRateLimit } from "../../utils/hand-rate-limit";

type SendVerificationOtpFn = WebAuthClient["emailOtp"]["sendVerificationOtp"];
type SendVerificationOtpParameters = Omit<Parameters<SendVerificationOtpFn>[0], "type">;
type SendVerificationOtpData = InferData<SendVerificationOtpFn>;
type SendVerificationOtpError = (NonNullable<InferError<SendVerificationOtpFn>> & RetryAfter) | null;
type SendVerificationOtpResult = Promise<{ data: SendVerificationOtpData, error: SendVerificationOtpError }>;

type SendVerificationOtpMutationState = {
    status: MutationStatus,
    data: SendVerificationOtpData,
    error: SendVerificationOtpError
}

type SendVerificationOtpAction =
    { type: "START" } |
    { type: "SUCCESS", payload: SendVerificationOtpData } |
    { type: "ERROR", payload: SendVerificationOtpError }

type HookReturnType = {
    sendVerificationOtp: (arsg: SendVerificationOtpParameters) => SendVerificationOtpResult;
    data: SendVerificationOtpData,
    error: SendVerificationOtpError,
    status: {
        isIdle: boolean,
        isPending: boolean,
        isSuccess: boolean,
        isError: boolean
    }
}
function reducer(state: SendVerificationOtpMutationState, action: SendVerificationOtpAction): SendVerificationOtpMutationState {
    switch (action.type) {
        case "START":
            return {
                status: "pending",
                data: null,
                error: null
            }
        case "SUCCESS":
            return {
                status: "success",
                data: action.payload,
                error: null
            }
        case "ERROR":
            return {
                status: "error",
                data: null,
                error: action.payload
            }
        default:
            return state;
    }
}

const initialState: SendVerificationOtpMutationState = {
    status: "idle",
    data: null,
    error: null
}

export function useSendVerificationOtp(client: WebAuthClient) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function sendVerificationOtp({ email }: SendVerificationOtpParameters) {
        let retryAfter = 0;
        dispatch({ type: "START" });
        const result = await client.emailOtp.sendVerificationOtp({
            email,
            type: "email-verification"
        }, {
            onError: (ctx : ErrorContext) => {
                const { retryAfter: rawRetryAfter } = handleRateLimit(ctx);
                retryAfter = rawRetryAfter;
            }
        });

        if (result.error) {
            dispatch({ type: "ERROR", payload: { ...result.error, retryAfter } });
            return { data: result.data, error: { ...result.error, retryAfter } };
        }

        dispatch({ type: "SUCCESS", payload: result.data });
        return result;
    }

    const result: HookReturnType = {
        sendVerificationOtp,
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