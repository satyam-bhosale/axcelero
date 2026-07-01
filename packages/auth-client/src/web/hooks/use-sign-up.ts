import { type ErrorContext } from "better-auth/react";
import { useReducer } from "react";
import { type WebAuthClient } from "../../types/auth-client.types";
import { type InferData, type InferError, type MutationStatus, type RetryAfter } from "../../types/hook.type";
import { handleRateLimit } from "../../utils/hand-rate-limit";

type SignUpFn = WebAuthClient["signUp"]["email"];
type SignUpParameters = Omit<Parameters<SignUpFn>[0], "name">;
type SignUpData = InferData<SignUpFn>;
type SignUpError = (NonNullable<InferError<SignUpFn>> & RetryAfter) | null;
type SignUpFnResult = Promise<{ data: SignUpData, error: SignUpError }>;

type SignUpMutationState = {
    status: MutationStatus,
    data: SignUpData,
    error: SignUpError
}

type SignUpAction =
    { type: "START" } |
    { type: "SUCCESS", payload: SignUpData } |
    { type: "ERROR", payload: SignUpError };

type HookReturnType = {
    signUp: (args: SignUpParameters) => SignUpFnResult,
    data: SignUpData,
    error: SignUpError,
    status: {
        isIdle: boolean,
        isPending: boolean,
        isSuccess: boolean,
        isError: boolean,
    }
}

function reducer(state: SignUpMutationState, action: SignUpAction): SignUpMutationState {
    switch (action.type) {
        case "START": {
            return {
                status: 'pending',
                data: null,
                error: null
            }
        }
        case "SUCCESS": {
            return {
                status: "success",
                data: action.payload,
                error: null
            }
        }
        case "ERROR": {
            return {
                status: 'error',
                data: null,
                error: action.payload
            }
        }
        default: {
            return state;
        }
    }
}

const initialState: SignUpMutationState = {
    status: 'idle',
    data: null,
    error: null
};

export function useSignUp(client: WebAuthClient) {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function signUp({ email, password }: SignUpParameters) {
        let retryAfter = 0;
        dispatch({ type: "START" });
        const result = await client.signUp.email({
            name: "__UNSET__",
            email,
            password
        }, {
            onError: (ctx : ErrorContext) => {
                const { retryAfter: rawRetryAfter } = handleRateLimit(ctx);
                retryAfter = rawRetryAfter;
            }
        });

        if (result.error) {
            dispatch({ type: "ERROR", payload: result.error });
            return { data: null, error: { ...result.error, retryAfter } };
        }

        dispatch({ type: "SUCCESS", payload: result.data });
        return result;
    }

    const returnValues: HookReturnType = {
        signUp,
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