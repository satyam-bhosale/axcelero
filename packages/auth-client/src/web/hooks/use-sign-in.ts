import { type ErrorContext } from "better-auth/react";
import { useReducer } from "react";
import { type WebAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";
import { handleRateLimit } from "../../utils/hand-rate-limit";

type SignInFn = WebAuthClient["signIn"]["email"];
type SignInParameters = Parameters<SignInFn>[0];
type SignInData = InferData<SignInFn>;
type SignInError = (NonNullable<InferError<SignInFn>> & RetryAfter) | null;
type SignInResult = Promise<{ data: SignInData, error: SignInError }>;

type SignInMutationState = {
    status: MutationStatus,
    data: SignInData,
    error: SignInError
};

type SignInAction =
    { type: "START" } |
    { type: "SUCCESS", payload: SignInData } |
    { type: "ERROR", payload: SignInError }

type HookReturnType = {
    signIn: (args: SignInParameters) => SignInResult,
    data: SignInData,
    error: SignInError,
    status: {
        isIdle: boolean,
        isPending: boolean,
        isSuccess: boolean,
        isError: boolean
    }
}

function reducer(state: SignInMutationState, action: SignInAction): SignInMutationState {
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
            return state
    }
}
const initialState: SignInMutationState = {
    status: "idle",
    data: null,
    error: null
}

export function useSignIn(client: WebAuthClient) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function signIn({ email, password, rememberMe }: SignInParameters) {
        let retryAfter = 0;

        dispatch({ type: "START" });
        const result = await client.signIn.email({
            email,
            password,
            rememberMe
        }, {
            onError: (ctx : ErrorContext) => {
                const { retryAfter: rawRetryAfter } = handleRateLimit(ctx);
                retryAfter = rawRetryAfter;
            }
        });

        if (result.error) {
            dispatch({ type: "ERROR", payload: { ...result.error, retryAfter } });
            return { data: result.data, error: { ...result.error, retryAfter } }
        }

        dispatch({ type: "SUCCESS", payload: result.data });
        return result;
    }

    const result: HookReturnType = {
        signIn,
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